const { getUrl } = require('../config/url');
const safeSerialize = require('../utils/safe-serialize');

// Only create socket connection when not in test environment
let socket;

if (process.env.NODE_ENV !== 'test' && !process.env.AVA_WORKER_ID) {
  const WS_URL = getUrl('ws');
  socket = require('socket.io-client')(WS_URL, {
    timeout: 5000,
    forceNew: true
  });
  
  // Ensure socket closes when process exits to prevent hanging
  process.on('exit', () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  });
  
  process.on('SIGINT', () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    process.exit(0);
  });
} else {
  // Mock socket for tests
  socket = {
    emit: () => {},
    connected: false,
    disconnect: () => {}
  };
}

module.exports = {
  events: [
    'console.error',
    'console.log',
    'network.failed_request',
    'codeceptjs:scenarios.updated',
    'codeceptjs:scenarios.parseerror',
    'codeceptjs:config.updated',
    'codeceptjs:file.changed',
    'codeceptjs.started',
    'codeceptjs.exit',
    'metastep.changed',
    'cli.start',
    'cli.stop',
    'cli.error',
    'cli.output',
    'cli.line',
    'cli.close',
    'suite.before',
    'test.before',
    'test.after',
    'test.failed',
    'test.passed',
    'step.before',
    'step.after',
    'step.comment',
    'step.passed',
    'finish',
  ],
  console: {
    jsError(err) {
      socket.emit('console.error', safeSerialize({
        type: 'js',
        error: err,
      }));
    },
    error(err) {
      socket.emit('console.error', safeSerialize({
        type: 'error',
        error: err,
      }));
    },
    log(type, url, lineno, args) {
      socket.emit('console.log', safeSerialize({
        type,
        url,
        lineno,
        args
      }));
    }
  },
  network: {
    failedRequest(data) {
      socket.emit('network.failed_request', safeSerialize(data));
    }
  },
  rtr: {
    suiteBefore(data) {
      socket.emit('suite.before', safeSerialize(data));
    },
    testBefore(data) {
      socket.emit('test.before', safeSerialize(data));
    },
    testAfter(data) {
      socket.emit('test.after', safeSerialize(data));
    },
    stepBefore(data) {
      socket.emit('step.before', safeSerialize(data));
    },
    stepAfter(data) {
      socket.emit('step.after', safeSerialize(data));
    },
    stepComment(comment) {
      socket.emit('step.comment', safeSerialize(comment));
    },
    stepPassed(data) {
      socket.emit('step.passed', safeSerialize(data));
    },
    metaStepChanged(data) {
      socket.emit('metastep.changed', safeSerialize(data));
    },
    testPassed(data) {
      socket.emit('test.passed', safeSerialize(data));
    },
    testFailed(data) {
      socket.emit('test.failed', safeSerialize(data));
    },
    testRunFinished() {
      socket.emit('testrun.finish');
    }
  },
  codeceptjs: {
    scenariosUpdated() {
      // just notify the frontend that scenarios have been changed
      // it's the frontends responsibilty to actually get
      // the updated list of scenarios
      socket.emit('codeceptjs:scenarios.updated');
    },
    scenariosParseError(err) {
      socket.emit('codeceptjs:scenarios.parseerror', safeSerialize({
        message: err.message,
        stack: err.stack,
      }));
    },
    configUpdated(configFile) {
      socket.emit('codeceptjs:config.updated', safeSerialize({
        file: configFile,
        timestamp: new Date().toISOString()
      }));
    },
    fileChanged(filePath, changeType) {
      socket.emit('codeceptjs:file.changed', safeSerialize({
        file: filePath,
        changeType: changeType, // 'add', 'change', 'unlink'
        timestamp: new Date().toISOString()
      }));
    },
    started(data) {
      socket.emit('codeceptjs.started', safeSerialize(data));
    },
    exit(data) {
      socket.emit('codeceptjs.exit', safeSerialize(data));
    },
    error(err) {
      socket.emit('codeceptjs.error', safeSerialize(err));
    }
  }
};
