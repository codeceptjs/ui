#!/usr/bin/env node
const path = require('path');
const express = require('express');
const app = express();
const io = require('socket.io')();
const open = require('open');

const {init} = require('../lib/commands/init');
const api = require('../lib/api');
const snapshotStore = require('../lib/model/snapshot-store');

(async function() {
  await init();
})()

// Base port
const PORT = 3000;

// Serve frontend from dist
const AppDir = path.join(__dirname, '..', 'dist');
/**
 * HTTP Routes
 */
app.use(express.static(AppDir));
app.use('/api', api);

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
    snapshotStore.clear();

    socket.broadcast.emit('suite.before', data);
  })

  socket.on('test.before', (data) => {
    snapshotStore.clear();

    socket.broadcast.emit('test.before', data);
  })

  socket.on('test.failed', (data) => {
    socket.broadcast.emit('test.failed', data);
  })

  socket.on('test.passed', (data) => {
    socket.broadcast.emit('test.passed', data);
  })

  socket.on('step.before', (data) => {
    const step = snapshotStore.add(data.id, data);
    socket.broadcast.emit('step.before', step);
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

open(`http://localhost:${PORT+1}`);

io.listen(PORT);
app.listen(PORT + 1);
