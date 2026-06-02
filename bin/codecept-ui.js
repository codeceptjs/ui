#!/usr/bin/env node
import Debug from 'debug';
const debug = Debug('codeceptjs:ui');

import path from 'path';
import { existsSync } from 'fs';
import express from 'express';
import init from '../lib/commands/init.js';
import codeceptjsFactory from '../lib/model/codeceptjs-factory.js';
import { getPort } from '../lib/config/env.js';
import { Server } from 'socket.io';
import { events } from '../lib/model/ws-events.js';

const options = init();

const io = new Server({
  cors: {
    origin: process.env.CORS_ORIGIN || `http://localhost:${getPort('application')}`,
    credentials: true,
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling']
  },
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  serveClient: true,
  allowRequest: (req, callback) => {
    const origin = req.headers.origin;
    const host = req.headers.host;
    
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') || 
        (host && origin.includes(host.split(':')[0]))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  }
});

const AppDir = path.join(import.meta.dirname, '..', 'dist');
if (!existsSync(AppDir)) {
  console.error('\n ⚠️You have to build Vue application by `npm run build`\n');
  process.exit(1);
}

codeceptjsFactory.create({}, options).then(async () => {
  debug('CodeceptJS initialized, starting application');

  const apiModule = await import('../lib/api/index.js');
  const api = apiModule.default;
  const app = express();

  app.use(express.static(AppDir));
  app.use('/api', api);

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

  let httpServer;
  let wsServer;

  try {
    wsServer = io.listen(webSocketsPort);
    debug(`WebSocket server started on port ${webSocketsPort}`);

    httpServer = app.listen(applicationPort, () => {
      console.log('🌟 CodeceptUI started!');
      console.log(`👉 Open http://localhost:${applicationPort} to see CodeceptUI in a browser\n\n`);
      debug(`Listening for websocket connections on port ${webSocketsPort}`);
    });

    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${applicationPort} is already in use. Please try a different port or stop the service using this port.`);
      } else {
        console.error(`❌ Failed to start HTTP server: ${err.message}`);
      }
      process.exit(1);
    });

    wsServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ WebSocket port ${webSocketsPort} is already in use. Please try a different port or stop the service using this port.`);
      } else {
        console.error(`❌ Failed to start WebSocket server: ${err.message}`);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }

  const gracefulShutdown = () => {
    console.log('\n🛑 Shutting down CodeceptUI...');
    if (httpServer) {
      httpServer.close(() => {
        debug('HTTP server closed');
      });
    }
    if (wsServer) {
      wsServer.close(() => {
        debug('WebSocket server closed');
      });
    }
    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    gracefulShutdown();
  });

  if (options.app) {
    global.isElectron = true;
    await import('../lib/commands/electron.js');
  }

}).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
