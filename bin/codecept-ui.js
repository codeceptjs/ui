#!/usr/bin/env node
const debug = require('debug')('codepress:codepress');
const { getPort } = require('../lib/config/env');

// initialize CodeceptJS
require('../lib/commands/init')();
const path = require('path');
const express = require('express');
const app = express();
const io = require('socket.io')();
const api = require('../lib/api');
const  { events } = require('../lib/model/ws-events');

// Base port
const PORT = getPort();

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


// eslint-disable-next-line no-console
debug(`Listening for websocket connections on port ${PORT}`);

// eslint-disable-next-line no-console
console.log('🌟 CodeceptUI started!');

// eslint-disable-next-line no-console
console.log(`👉 Open http://localhost:${PORT+1} see CodeceptUI a browser\n\n`);

io.listen(PORT);
app.listen(PORT + 1);
