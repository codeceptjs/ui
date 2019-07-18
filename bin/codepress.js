#!/usr/bin/env node
const debug = require('debug')('codepress');
const path = require('path');
const express = require('express');
const app = express();
const io = require('socket.io')();
const open = require('open');

const {init} = require('../lib/commands/init');
const api = require('../lib/api');
const snapshotStore = require('../lib/model/snapshot-store');

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
  const emit = (evtName, data) => {
    debug(evtName);
    socket.broadcast.emit(evtName, data);
  }
  debug('socket connects');

  socket.on('cli.start', (data) => {
    emit('cli.start', data);
  })
  socket.on('cli.stop', (data) => {
    emit('cli.stop', data);
  })
  socket.on('cli.error', (data) => {
    emit('cli.error', data);
  })
  socket.on('cli.output', (data) => {
    emit('cli.output', data);
  })
  socket.on('cli.line', (data) => {
    emit('cli.line', data);
  })
  socket.on('cli.close', (data) => {
    emit('cli.close', data);
  })

  socket.on('suite.before', (data) => {
    snapshotStore.clear();

    emit('suite.before', data);
  })

  socket.on('test.before', (data) => {
    snapshotStore.clear();

    emit('test.before', data);
  })

  socket.on('test.failed', (data) => {
    const dataWithoutSnapshot = snapshotStore.add(data.id, data);
    emit('test.failed', dataWithoutSnapshot);
  })

  socket.on('test.passed', (data) => {
    const dataWithoutSnapshot = snapshotStore.add(data.id, data);
    emit('test.passed', dataWithoutSnapshot);
  })

  socket.on('step.before', (data) => {
    const step = snapshotStore.add(data.id, data);
    emit('step.before', step);
  })

  socket.on('finish', (data) => {
    emit('finish', data);
  })

  socket.on('disconnect', () => {
    debug('socket disconnects')
   });
});

(async function() {
  await init();

  // eslint-disable-next-line no-console
  debug(`Listening for websocket connections on port ${PORT}`);

  // open(`http://localhost:${PORT+1}`);

  io.listen(PORT);
  app.listen(PORT + 1);
})()

