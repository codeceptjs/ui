#!/usr/bin/env node
const debug = require('debug')('codeceptjs:ui');

// initialize CodeceptJS and return startup options
const path = require('path');
const { existsSync } = require('fs');
const express = require('express');
const options = require('../lib/commands/init')();
const codeceptjsFactory = require('../lib/model/codeceptjs-factory');
const { getPort } = require('../lib/config/env');

// Configure Socket.IO with CORS support for cross-origin requests
const io = require('socket.io')({
  cors: {
    origin: process.env.CORS_ORIGIN || `http://localhost:${getPort('application')}`,
    credentials: true,
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling']
  },
  allowEIO3: true,  // Support for older Socket.IO clients
  // Add additional configuration for better reliability
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  serveClient: true,
  // Allow connections from localhost variations
  allowRequest: (req, callback) => {
    const origin = req.headers.origin;
    const host = req.headers.host;
    
    // Allow localhost connections and same-host connections
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1') || 
        (host && origin.includes(host.split(':')[0]))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now, can be more restrictive if needed
    }
  }
});

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

  // Start servers with proper error handling and readiness checks
  let httpServer;
  let wsServer;

  try {
    // Start WebSocket server first
    wsServer = io.listen(webSocketsPort);
    debug(`WebSocket server started on port ${webSocketsPort}`);

    // Start HTTP server
    httpServer = app.listen(applicationPort, () => {
      // eslint-disable-next-line no-console
      console.log('🌟 CodeceptUI started!');
      // eslint-disable-next-line no-console
      console.log(`👉 Open http://localhost:${applicationPort} to see CodeceptUI in a browser\n\n`);
      // eslint-disable-next-line no-console
      debug(`Listening for websocket connections on port ${webSocketsPort}`);
    });

    // Handle server errors
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

  // Graceful shutdown handling
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
    // open electron app
    global.isElectron = true;
    require('../lib/commands/electron');
  }

}).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
