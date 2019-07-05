#!/usr/bin/env node

var express = require('express');
var app = express();
const io = require('socket.io')();

app.use(express.static('./dist'));

const PORT = 3000;

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
    socket.broadcast.emit('suite.before', data);
  })

  socket.on('test.before', (data) => {
    socket.broadcast.emit('test.before', data);
  })

  socket.on('test.failed', (data) => {
    socket.broadcast.emit('test.failed', data);
  })

  socket.on('test.passed', (data) => {
    socket.broadcast.emit('test.passed', data);
  })

  socket.on('step.before', (data) => {
    socket.broadcast.emit('step.before', data);
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
console.log(`Waiting for websocket connections on port ${PORT}`);
// eslint-disable-next-line no-console
console.log(`Go to http://localhost:${PORT+1}`);

io.listen(PORT);
app.listen(PORT + 1);
