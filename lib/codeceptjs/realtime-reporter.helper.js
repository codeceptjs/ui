const debug = require('debug')('codepress:realtime-reporter-helper');
const crypto = require('crypto');
const assert = require('assert');
const event = require('codeceptjs/lib/event');
const wsEvents = require('../model/ws-events');

const brk = require('./brk')
const {
  toError,
  isSnapshotStep,
  isSnapshotStepBefore,
  isScreenshotStep,
  takeSnapshot,
  filterStack,
  stringifySafe
} = require('./reporter-utils');

const hashString = (...args) => {
  const str = args.join('-')
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  hash.write(str);
  hash.end();
  return hash.read();
};

const mapSuiteAndTest = (suite, test) => {
  return {
    // TODO startdate
    id: suite && test && hashString(suite.title, test.title, test.file),
    suite: suite && suite.title,
    title: test && test.title,
    file: test && test.file,
    steps: [],
  }
}
const mapStep = ({testStartedAt, id, step, snapshot, returnValue}) => {
  assert(id, 'id is required');
  assert(step, 'step is required');

  return {
    id,
    at: Date.now() - testStartedAt,
    duration: Date.now() - step.startTime,
    actor: 'I',
    humanized: step.humanize(),
    humanizedArgs: step.humanizeArgs(),
    name: step.name,
    args: step.args,
    snapshot,
    metaStep: mapMetaStep(step.metaStep),
    returnValue,
    stack: filterStack(step),
  }
}

const mapMetaStep = (metaStep) => {
  if (!metaStep) return;

  return {
    actor: metaStep.actor,
    name: metaStep.name
  }
}

const isEqualMetaStep = (metastep1, metastep2) => {
  if (!metastep1 && !metastep2) return true;
  if (!metastep1 || !metastep2) return false;
  return metastep1.actor === metastep2.actor && metastep1.name === metastep2.name;
}

// eslint-disable-next-line no-undef
let Helper = codecept_helper;

/**
 * Report test progress in realtime
 */
class RealtimeReporterHelper extends Helper {
  constructor(options) {
    super(options);

    debug('constructor', options);

    this.isConnected = false;
    this.stepIndex = 1;
    this.suite = undefined;
    this.test = undefined;
    this.step = undefined;
    this.metaStep = undefined;
    this.nextForceTakeSnapshot = undefined;

    event.dispatcher.on('step.comment', (msg) => {
      wsEvents.rtr.stepComment({
        id: this.stepIndex++,
        at: Date.now() - this.testStartedAt,
        actor: 'I',
        name: 'say',
        args: [msg],
        humanized: 'I say',
        snapshot: undefined,
        stack: {}
      });
    });
    event.dispatcher.on('step.passed', async (step, retvalPromise) => {
      let retval;
      try {
        retval = await retvalPromise;
        if (retval) {
          retval = stringifySafe(retval);
        }
      } catch (err) {} // eslint-disable-line no-empty
      wsEvents.rtr.stepPassed(
        mapStep({
          testStartedAt: this.testStartedAt, 
          id: this.stepIndex, 
          step, 
          snapshot: undefined, 
          retval
        })
      );
    });
  }

  _init() {
    debug('init');

    // TODO Should I override pause() instead?
    global.brk = brk;
  }

  _isEnabled() {
    return true;
  }

  _getHelper() {
    return this.helpers['Appium'] || this.helpers['Webdriver'] || this.helpers['Puppeteer'];
  }

  async _beforeSuite(suite) {  
    if (!this._isEnabled()) return;
    this.suite = suite; 
   
    wsEvents.rtr.suiteBefore(mapSuiteAndTest(this.suite, this.test));
  }

  async _before(t) {
    if (!this._isEnabled(t)) return;

    t.retries(0); // disable retries in web ui
    this.test = t;
    this.testStartedAt = Date.now();
    this.stepIndex = 0;
    this.step = undefined;
    this.metaStep = undefined;

    wsEvents.rtr.testBefore(mapSuiteAndTest(this.suite, this.test));
  }

  async _emitSnapshot(helper, s, takeScreenshot = false) {
    if (this.nextForceTakeSnapshot) {
      this.debug('Previous step is forcing this snapshot', s.name);
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
    wsEvents.rtr.stepBefore(
      mapStep({
        testStartedAt: this.testStartedAt, 
        id: this.stepIndex, 
        step: s, 
        snapshot, 
        returnValue
      })
    );

    this.nextForceTakeSnapshot = false;

    return snapshot;
  }

  _emitMetaStepChangedIfNecessary() {
    if (!isEqualMetaStep(this.step.metaStep, this.metaStep)) {
      // NOTE this.metaStep can be null which means "no metastep"
      wsEvents.rtr.metaStepChanged(this.step.metaStep);
      this.metaStep = this.step.metaStep;
    }
  }

  async _beforeStep(s) {
    if (!this._isEnabled(this.test)) return;

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
    if (!this._isEnabled(this.test)) return;
    
    const helper = this._getHelper();

    if (isSnapshotStepBefore(this.step)) {
      this.nextForceTakeSnapshot = true; // we already have a before snapshot, so defer to next step
    } else {
      await this._emitSnapshot(helper, this.step);
    }
  }

  async _passed() {
    if (!this._isEnabled(this.test)) return;

    const helper = this._getHelper();

    // Make sure we always have a full snapshot on the last step
    const snapshot = await takeSnapshot(helper, this.stepIndex, true);

    wsEvents.rtr.testPassed({
      id: this.stepIndex,
      duration: (Date.now() - this.testStartedAt) / 1000,
      snapshot,
    });
  
  }

  async _failed(t) {
    if (!this._isEnabled(this.test)) return;

    const helper = this._getHelper();

    // afterStep is not called when the step fails
    // therefore we need to emit the step snapshot here

    // TODO Fix duplicate last step when a non step error occurs in the test
    const snapshot = await this._emitSnapshot(helper, this.step, true);

    wsEvents.rtr.testFailed({
      id: this.stepIndex,
      duration: (Date.now() - this.testStartedAt) / 1000,
      error: toError(t.err),
      snapshot,
    });
  }

  _finishTest() {
    debug('finishTest');
    if (!this._isEnabled(this.test)) return;

    wsEvents.rtr.testRunFinished();
  }
}

module.exports = RealtimeReporterHelper;
