#!/usr/bin/env node
const debug = require('debug')('codepress:codepress');
const { getPort } = require('../lib/config/env');

// initialize CodeceptJS
require('../lib/commands/init')();
const path = require('path');
const existsSync = require('fs').existsSync;
const express = require('express');
const app = express();
const io = require('socket.io')();
const api = require('../lib/api');
const  { events } = require('../lib/model/ws-events');

const applicationPort = getPort('application');
const webSocketsPort = getPort('ws');

// Serve frontend from dist
const AppDir = path.join(__dirname, '..', 'dist');
if (!existsSync(AppDir)) {
  throw Error('You have to build Vue application by `npm run build`');
}
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
      emit(eventName, data);
    });
  }
});

// eslint-disable-next-line no-console
console.log('🌟 CodeceptUI started!');

// eslint-disable-next-line no-console
console.log(`👉 Open http://localhost:${applicationPort} see CodeceptUI a browser\n\n`);

// eslint-disable-next-line no-console
debug(`Listening for websocket connections on port ${webSocketsPort}`);

io.listen(webSocketsPort);
app.listen(applicationPort);
