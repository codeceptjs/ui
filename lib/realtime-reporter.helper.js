const assert = require('assert');

const {
  toError,
  isSnapshotStep,
  takeSnapshot,
} = require('./reporter-utils');

let Helper = codecept_helper;

let socket;

const mapSuiteAndTest = (suite, test) => {
  return {
    // TODO startdate
    suite: suite && suite.title,
    title: test && test.title,
    file: test && test.file,
    steps: [],
  }
}

class RealtimeReporterHelper extends Helper {
  constructor(options) {
    super(options);

    // TODO Make this configurable
    socket = require('socket.io-client')('http://localhost:3000');

    this.isConnected = false;
    this.stepIndex = 1;
    this.suite = undefined;
    this.test = undefined;

    socket.on('connect', () => {
      this.isConnected = true;
    });
  }

  _init() {
    // TODO Add I.say
  }

  _getHelper() {
    return this.helpers['Appium'] || this.helpers['Webdriver'] || this.helpers['Puppeteer'];
  }

  _beforeSuite(suite) {
    if (!this.isConnected) return;
    this.suite = suite;

    socket.emit('suite.before', mapSuiteAndTest(this.suite, this.test));
  }

  _before(t) {
    if (!this.isConnected) return;
    assert(this.isConnected, 'A websocket connection is required')

    this.test = t;
    this.stepIndex = 1;

    socket.emit('test.before', mapSuiteAndTest(this.suite, this.test));
  }

  // async _beforeStep(s) {
  //   if (!this.isConnected) return;
  //   const helper = this._getHelper();

  //   let snapshot;
  //   if (isSnapshotStep(s)) {
  //     snapshot = await takeSnapshot(helper);
  //   }

  //   socket.emit('step.before', {
  //     id: this.stepIndex,
  //     humanized: s.humanize(),
  //     humanizedArgs: s.humanizeArgs(),
  //     name: s.name,
  //     args: s.args,
  //     snapshot
  //   });
  // }

  async _afterStep(s) {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    let snapshot;
    if (isSnapshotStep(s)) {
      snapshot = await takeSnapshot(helper);
    }

    socket.emit('step.before', {
      id: this.stepIndex,
      humanized: s.humanize(),
      humanizedArgs: s.humanizeArgs(),
      name: s.name,
      args: s.args,
      snapshot
    });
  }


  async _passed() {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    const snapshot = await takeSnapshot(helper);
    socket.emit('test.passed', {
      snapshot,
    });
  }

  async _failed(t) {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    const snapshot = await takeSnapshot(helper);
    socket.emit('test.failed', {
      error: toError(t.err),
      snapshot,
    });
  }

  _finishTest() {
    if (!this.isConnected) return;
    socket.emit('finish');
    socket.close();
  }
}

module.exports = RealtimeReporterHelper;
