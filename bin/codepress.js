#!/usr/bin/env node
const express = require('express');
const app = express();
const io = require('socket.io')();

const {init} = require('../lib/init');

init();

// Base port
const PORT = 3000;

// Store
let steps = {}

const processStep = step => {
  if (step.snapshot && step.snapshot.sourceContentType === 'html') {
    const url = new URL(step.snapshot.pageUrl);

    // Fix up css and script links
    let processedSource = step.snapshot.source;
    processedSource = processedSource.replace(/href="([^\/])/gi, `href="${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}${url.pathname}$1`);
    processedSource = processedSource.replace(/href="\/\//gi, `href="https://`);
    processedSource = processedSource.replace(/href="\//gi, `href="https://${url.hostname}/`);
  
    step.snapshot.source = processedSource;  
  }
  return step; 
}

/**
 * HTTP Routes
 */
app.use(express.static(__dirname + '/dist'));

app.get('/api/snapshots/html/:id', function (req, res) {
  const {id} = req.params;

  if (!steps[id]) {
    res.status(404).send(`No step for id ${id}`);
    return;
  }
  if (!steps[id].snapshot) {
    res.status(404).send(`No snapshot for step id ${id}`);
    return;
  }

  res.send(steps[id].snapshot.source);
});

/**
 * Websocket Events
 */
io.on('connection', socket => {
  // eslint-disable-next-line no-console
  console.log('socket connects');

  socket.on('cli.start', (data) => {
    socket.broadcast.emit('cli.start', data);
  })
  socket.on('cli.stop', (data) => {
    socket.broadcast.emit('cli.stop', data);
  })
  socket.on('cli.error', (data) => {
    socket.broadcast.emit('cli.error', data);
  })
  socket.on('cli.output', (data) => {
    socket.broadcast.emit('cli.output', data);
  })
  socket.on('cli.line', (data) => {
    socket.broadcast.emit('cli.line', data);
  })
  socket.on('cli.close', (data) => {
    socket.broadcast.emit('cli.close', data);
  })

  socket.on('suite.before', (data) => {
    steps = {};

    socket.broadcast.emit('suite.before', data);
  })

  socket.on('test.before', (data) => {
    steps = {};

    socket.broadcast.emit('test.before', data);
  })

  socket.on('test.failed', (data) => {
    socket.broadcast.emit('test.failed', data);
  })

  socket.on('test.passed', (data) => {
    socket.broadcast.emit('test.passed', data);
  })

  socket.on('step.before', (data) => {
    steps[data.id] = processStep(data);

    socket.broadcast.emit('step.before', steps[data.id]);
  })

  socket.on('finish', (data) => {
    socket.broadcast.emit('finish', data);
  })

  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('socket disconnects')
   });
});

// eslint-disable-next-line no-console
console.log(`Listening for websocket connections on port ${PORT}`);
// eslint-disable-next-line no-console
console.log(`Go to http://localhost:${PORT+1}`);

io.listen(PORT);
app.listen(PORT + 1);
