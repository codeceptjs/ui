#!/usr/bin/env node
const debug = require('debug')('codepress:codepress');

// initialize CodeceptJS and return startup options
const options = require('../lib/commands/init')();
const path = require('path');
const existsSync = require('fs').existsSync;
const express = require('express');
const app = express();
const io = require('socket.io')();
const api = require('../lib/api');
const  { events } = require('../lib/model/ws-events');

// Serve frontend from dist
const AppDir = path.join(__dirname, '..', 'dist');
if (!existsSync(AppDir)) {
  // eslint-disable-next-line no-console
  console.error('\n ⚠️You have to build Vue application by `npm run build`\n');
  process.exit(1);
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

const applicationPort = options.port;
const webSocketsPort = options.wsPort;

io.listen(webSocketsPort);
app.listen(applicationPort);

// eslint-disable-next-line no-console
console.log('🌟 CodeceptUI started!');

// eslint-disable-next-line no-console
console.log(`👉 Open http://localhost:${applicationPort} see CodeceptUI a browser\n\n`);

// eslint-disable-next-line no-console
debug(`Listening for websocket connections on port ${webSocketsPort}`);

if (options.app) {
  // open electron app
  global.isElectron = true;
  require('../lib/commands/electron');
}
