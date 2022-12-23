#!/usr/bin/env node
const debug = require('debug')('codeceptjs:ui');

// initialize CodeceptJS and return startup options
const path = require('path');
const { existsSync } = require('fs');
const express = require('express');
const options = require('../lib/commands/init')();
const codeceptjsFactory = require('../lib/model/codeceptjs-factory');
const io = require('socket.io')();
const  { events } = require('../lib/model/ws-events');

// Serve frontend from dist
const AppDir = path.join(__dirname, '..', 'dist');
if (!existsSync(AppDir)) {
  // eslint-disable-next-line no-console
  console.error('\n ⚠️You have to build Vue application by `npm run build`\n');
  process.exit(1);
}


codeceptjsFactory.create({}, options).then(() => {
  debug('CodeceptJS initialized, starting application');

  const api = require('../lib/api');
  const app = express();



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
  console.log(`👉 Open http://localhost:${applicationPort} to see CodeceptUI in a browser\n\n`);

  // eslint-disable-next-line no-console
  debug(`Listening for websocket connections on port ${webSocketsPort}`);

  if (options.app) {
    // open electron app
    global.isElectron = true;
    require('../lib/commands/electron');
  }

}).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
