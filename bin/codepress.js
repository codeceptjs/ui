#!/usr/bin/env node
const debug = require('debug')('codepress:codepress');
const path = require('path');
const express = require('express');
const app = express();
const io = require('socket.io')();

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

const proxyEvents = {
  'codeceptjs:scenarios.updated': undefined, 
  'codeceptjs:scenarios.parseerror': undefined,
  'codeceptjs.started': () => snapshotStore.clear(), 
  'codeceptjs.exit': undefined, 
  'metastep.changed': undefined,
  'cli.start': undefined, 
  'cli.stop': undefined, 
  'cli.error': undefined, 
  'cli.output': undefined, 
  'cli.line': undefined, 
  'cli.close': undefined,
  'suite.before': undefined,
  'test.before': undefined,
  'test.after': undefined,
  'test.failed': (data) => snapshotStore.add(data.id, data),
  'test.passed': (data) => snapshotStore.add(data.id, data), 
  'step.before': (data) => snapshotStore.add(data.id, data),
  'step.comment': undefined, 
  'step.passed': undefined,
  'finish': undefined, 
}
/**
 * Websocket Events
 */
io.on('connection', socket => {
  const emit = (evtName, data) => {
    debug(evtName);
    socket.broadcast.emit(evtName, data);
  }
  debug('socket connects');

  for (let eventName in proxyEvents) {
    socket.on(eventName, (data) => {
      const localEventName = eventName;
      const fn = proxyEvents[localEventName];
      let newData = data;
      if (fn) {
        newData = fn(data);
      }
      emit(localEventName, newData);
    })
  }  
});

(async function() {
  await init();

  // eslint-disable-next-line no-console
  debug(`Listening for websocket connections on port ${PORT}`);

  // eslint-disable-next-line no-console
  console.log(`Open http://localhost:${PORT+1} in your web browser!`);

  io.listen(PORT);
  app.listen(PORT + 1);
})()

