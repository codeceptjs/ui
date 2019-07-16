const assert = require('assert');

// const {installMouseHelper} = require('./install-mouse-helper');

const brk = require('./brk')
const {
  toError,
  isSnapshotStep,
  isScreenshotStep,
  takeSnapshot,
} = require('./reporter-utils');

// eslint-disable-next-line no-undef
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
const mapMetaStep = (metaStep) => {
  if (!metaStep) return;

  return {
    actor: metaStep.actor,
    name: metaStep.name
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
    this.step = undefined;

    socket.on('connect', () => {
      this.isConnected = true;
    });
  }

  _init() {
    // TODO Should I override pause() instead?
    global.brk = brk;
  }

  _getHelper() {
    return this.helpers['Appium'] || this.helpers['Webdriver'] || this.helpers['Puppeteer'];
  }

  async _beforeSuite(suite) {  
    if (!this.isConnected) return;
    this.suite = suite; 
   
    socket.emit('suite.before', mapSuiteAndTest(this.suite, this.test));
  }

  async _before(t) {
    if (!this.isConnected) return;
    assert(this.isConnected, 'A websocket connection is required')

    // const helper = this._getHelper();
    // if (helper.page) {
    //   console.log('Install mouse helper')
    //   await installMouseHelper(helper.page);
    // }

    this.test = t;
    this.stepIndex = 1;
    this.step = undefined;

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

  async _emitSnapshot(helper, s, takeScreenshot = false) {
    let snapshot;
    if (takeScreenshot || isSnapshotStep(s)) {
      snapshot = await takeSnapshot(helper, this.stepIndex, isScreenshotStep(s) || takeScreenshot);
    }

    let grabValue;
    if (s.name.startsWith('grab')) {
      // Get the grabbed value
      grabValue = await helper[s.name](...s.args);
    }

    // TODO Change event name
    socket.emit('step.before', {
      id: this.stepIndex,
      actor: 'I',
      humanized: s.humanize(),
      humanizedArgs: s.humanizeArgs(),
      name: s.name,
      args: s.args,
      snapshot,
      metaStep: mapMetaStep(s.metaStep),
      grabValue
    });

    this.stepIndex++;
  }

  async _beforeStep(s) {
    this.step = s; // store current step

    // TODO Make snapshot also before for certain steps (click)
  }

  async _afterStep() {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    await this._emitSnapshot(helper, this.step);
  }

  async _passed() {
    if (!this.isConnected) return;

    socket.emit('test.passed', {});
  }

  async _failed(t) {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    await this._emitSnapshot(helper, this.step, true);

    socket.emit('test.failed', {
      error: toError(t.err),
    });
  }

  _finishTest() {
    if (!this.isConnected) return;
    socket.emit('finish');
    socket.close();
  }
}

module.exports = RealtimeReporterHelper;
