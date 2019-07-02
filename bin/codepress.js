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
    // eslint-disable-next-line no-console
    console.log('cli.start');
    socket.broadcast.emit('cli.start', data);
  })
  socket.on('cli.output', (data) => {
    socket.broadcast.emit('cli.output', data);
  })
  socket.on('cli.error', (data) => {
    socket.broadcast.emit('cli.error', data);
  })

  socket.on('suite.before', (data) => {
    // eslint-disable-next-line no-console
    // console.log(data);

    socket.broadcast.emit('suite.before', data);
  })

  socket.on('test.before', (data) => {
    // eslint-disable-next-line no-console
    // console.log(data);

    socket.broadcast.emit('test.before', data);
  })

  socket.on('test.failed', (data) => {
    // eslint-disable-next-line no-console
    console.log('ERROR', data);

    socket.broadcast.emit('test.failed', data);
  })

  socket.on('test.passed', (data) => {
    // eslint-disable-next-line no-console
    console.log('SUCCESS', data);

    socket.broadcast.emit('test.passed', data);
  })

  socket.on('step.before', (data) => {
    // eslint-disable-next-line no-console
    // console.log(data);

    socket.broadcast.emit('step.before', data);
  })

  socket.on('finish', (data) => {
    // eslint-disable-next-line no-console
    // console.log('Testrun finished');

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
