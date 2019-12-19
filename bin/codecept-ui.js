#!/usr/bin/env node
const debug = require('debug')('codepress:codepress');

// initialize CodeceptJS
require('../lib/commands/init')();
const path = require('path');
const express = require('express');
const app = express();
const io = require('socket.io')();
const api = require('../lib/api');
const  { events } = require('../lib/model/ws-events');
const snapshotStore = require('../lib/model/snapshot-store');
const scenarioStatusRepository = require('../lib/model/scenario-status-repository');

// Base port
const PORT = Number(process.env.npm_package_config_port);

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
  };
  debug('socket connects');

  for (const eventName of events) {
    socket.on(eventName, (data) => {
      const localEventName = eventName;
      emit(localEventName, data);
    });
  }
});

(async function() {
  


  // eslint-disable-next-line no-console
  debug(`Listening for websocket connections on port ${PORT}`);

  // eslint-disable-next-line no-console
  console.log(`Open http://localhost:${PORT+1} in your web browser!`);

  io.listen(PORT);
  app.listen(PORT + 1);
})();

