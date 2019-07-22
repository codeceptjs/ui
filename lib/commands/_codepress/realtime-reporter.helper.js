const assert = require('assert');

const recorder = require('codeceptjs').recorder;
// const {installMouseHelper} = require('./install-mouse-helper');

const WS_URL = 'http://localhost:3000';

const brk = require('./brk')
const {
  toError,
  isSnapshotStep,
  isSnapshotStepBefore,
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
    // console.log('Connecting socket...')
    socket = require('socket.io-client')(WS_URL);

    this.isConnected = false;
    this.stepIndex = 1;
    this.suite = undefined;
    this.test = undefined;
    this.step = undefined;
    this.metaStep = undefined;
    this.nextForceTakeSnapshot = undefined;

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
    this.testStartedAt = Date.now();
    this.stepIndex = 0;
    this.step = undefined;
    this.metaStep = undefined;

    socket.emit('test.before', mapSuiteAndTest(this.suite, this.test));
  }

  async _emitSnapshot(helper, s, takeScreenshot = false) {
    if (this.nextForceTakeSnapshot) {
      console.log('forcing this snapshot', s.name);
    }

    let snapshot = this.savedSnapshot;
    if (this.nextForceTakeSnapshot || takeScreenshot || isSnapshotStep(s)) {
      snapshot = await takeSnapshot(helper, this.stepIndex, isScreenshotStep(s) || takeScreenshot);
    }

    let returnValue;
    if (s.name.startsWith('grab')) {
      // Get the grabbed value
      returnValue = await helper[s.name](...s.args);
    }

    // TODO Change event name
    socket.emit('step.before', {
      id: this.stepIndex,
      duration: (Date.now() - this.stepStartedAt),
      actor: 'I',
      humanized: s.humanize(),
      humanizedArgs: s.humanizeArgs(),
      name: s.name,
      args: s.args,
      snapshot,
      metaStep: mapMetaStep(s.metaStep),
      returnValue,
    });

    this.nextForceTakeSnapshot = false;

    return snapshot;
  }

  _emitMetaStepChangedIfNecessary() {
    if (JSON.stringify(this.step.metaStep) !== JSON.stringify(this.metaStep)) {
      socket.emit('metastep.changed', this.metaStep);
      this.metaStep = this.step.metaStep;
    }
  }

  async _beforeStep(s) {
    this.stepIndex++;
    this.step = s; // store current step
    this.stepStartedAt = Date.now();

    const helper = this._getHelper();

    this._emitMetaStepChangedIfNecessary();

    if (isSnapshotStepBefore(this.step)) {
      await this._emitSnapshot(helper, this.step);
    }
  }

  async _afterStep() {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    if (isSnapshotStepBefore(this.step)) {
      this.nextForceTakeSnapshot = true; // we already have a before snapshot, so defer to next step
    } else {
      await this._emitSnapshot(helper, this.step);
    }
  }

  async _passed() {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    // Make sure we always have a full snapshot on the last step
    const snapshot = await takeSnapshot(helper, this.stepIndex, true);

    socket.emit('test.passed', {
      id: this.stepIndex,
      duration: (Date.now() - this.testStartedAt) / 1000,
      snapshot,
    });
  }

  async _failed(t) {
    if (!this.isConnected) return;
    const helper = this._getHelper();

    // afterStep is not called when the step fails
    // therefore we need to emit the step snapshot here

    // TODO Fix duplicate last step when a non step error occurs in the test
    const snapshot = await this._emitSnapshot(helper, this.step, true);

    socket.emit('test.failed', {
      id: this.stepIndex,
      duration: (Date.now() - this.testStartedAt) / 1000,
      error: toError(t.err),
      snapshot,
    });

    // console.log('test failed -> adding break');
    // recorder.add('break', () => {
    //   brk();
    // })
  }

  _finishTest() {
    if (!this.isConnected) return;
    socket.emit('finish');
    socket.close();
  }

  async comment(value) {
    return Promise.resolve(value);
  }
}

module.exports = RealtimeReporterHelper;
