const { getUrl } = require('../config/url');
const WS_URL = getUrl('ws');

const socket = require('socket.io-client')(WS_URL);

module.exports = {
  events: [
    'console.error',
    'console.log',
    'network.failed_request',
    'codeceptjs:scenarios.updated',
    'codeceptjs:scenarios.parseerror',
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
      socket.emit('console.error', {
        type: 'js',
        error: err,
      });
    },
    error(err) {
      socket.emit('console.error', {
        type: 'error',
        error: err,
      });
    },
    log(type, url, lineno, args) {
      socket.emit('console.log', {
        type,
        url,
        lineno,
        args
      });
    }
  },
  network: {
    failedRequest(data) {
      socket.emit('network.failed_request', data);
    }
  },
  rtr: {
    suiteBefore(data) {
      socket.emit('suite.before', data);
    },
    testBefore(data) {
      socket.emit('test.before', data);
    },
    testAfter(data) {
      socket.emit('test.after', data);
    },
    stepBefore(data) {
      socket.emit('step.before', data);
    },
    stepAfter(data) {
      socket.emit('step.after', data);
    },
    stepComment(comment) {
      socket.emit('step.comment', comment);
    },
    stepPassed(data) {
      socket.emit('step.passed', data);
    },
    metaStepChanged(data) {
      socket.emit('metastep.changed', data);
    },
    testPassed(data) {
      socket.emit('test.passed', data);
    },
    testFailed(data) {
      socket.emit('test.failed', data);
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
      socket.emit('codeceptjs:scenarios.parseerror', {
        message: err.message,
        stack: err.stack,
      });
    },
    started(data) {
      socket.emit('codeceptjs.started', data);
    },
    exit(data) {
      socket.emit('codeceptjs.exit', data);
    },
    error(err) {
      socket.emit('codeceptjs.error', err);
    }
  }
};
