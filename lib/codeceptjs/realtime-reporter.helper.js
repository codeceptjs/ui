const debug = require('debug')('codepress:realtime-reporter-helper');
const assert = require('assert');
const { event, store } = require('codeceptjs');
const wsEvents = require('../model/ws-events');

const {
  toError,
  isRetvalStep,
  isSnapshotStep,
  isScreenshotStep,
  takeSnapshot,
  filterStack,
  getRetval
} = require('./reporter-utils');

const mapSuiteAndTest = (startedAt, suite, test) => {
  return {
    startedAt,
    id: test && test.id || suite && suite.id,
    suite: suite && suite.title,
    title: test && test.title,
    file: test && test.file,
    steps: [],
  }
}
const mapArgs = (args) => {
  return args.map(a => {
    if (typeof a === "function") return a.toString();
    if (typeof a === "object") {
      if (a.constructor.name === 'Locator') return a.toString();
      if (a.constructor.name === 'Secret') return a.toString();
    }
    return a;
  });
}

const isEqualMetaStep = (metastep1, metastep2) => {
  if (!metastep1 && !metastep2) return true;
  if (!metastep1 || !metastep2) return false;
  return metastep1.actor === metastep2.actor
    && metastep1.name === metastep2.name
    && metastep1.args.join(',') === metastep2.args.join(',');
}

// eslint-disable-next-line no-undef
let Helper = codecept_helper;

/**
 * Report test progress in realtime
 */
class RealtimeReporterHelper extends Helper {
  constructor(options) {
    super(options);

    this.isConnected = false;
    this.stepIndex = 1;
    this.suite = undefined;
    this.test = undefined;
    this.step = undefined;
    this.metaStep = undefined;
    this.nextForceTakeSnapshot = undefined;

    event.dispatcher.on('step.comment', (msg) => {
      // console.log('comment', msg);
      // ignore metasteps as comment events
      if (this.metaStep && `${this.metaStep.actor} ${this.metaStep.name}` == msg.trim()) return;
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
      if (!isRetvalStep(step)) return;
      
      const returnValue = await getRetval(step, retvalPromise);

      wsEvents.rtr.stepPassed(
        this._mapStep({
          testStartedAt: this.testStartedAt,
          id: this.stepIndex,
          step,
          snapshot: undefined,
          returnValue
        })
      );
    });
  }

  _init() {
    debug('init');
  }

  _isEnabled() {
    return true;
  }

  _getHelper() {
    return this.helpers['Appium'] || this.helpers['WebDriver'] || this.helpers['WebDriverIO'] || this.helpers['Puppeteer'] || this.helpers['TestCafe'];
  }

  _generateSection(metaStep, append = false) {
    if (!metaStep) return;
    const line = this._stringifyMetaStep(metaStep);
    if (append) this.loggedMetaSteps.push(line);
    return line;

  }

  _mapMetaStep(metaStep, isNewSection = false) {
    if (!metaStep) return;

    const result = {
      actor: metaStep.actor,
      name: metaStep.name,
      args: metaStep.args,
    };
    
    if (metaStep.metaStep) {
      result.metaStep = this._mapMetaStep(metaStep.metaStep, isNewSection);
      result.section = this._generateSection(metaStep.metaStep)
    }

    if (isNewSection) {
      result.opens = this._generateSection(metaStep, false);
    }

    return result;
  }


  _stringifyMetaStep(metaStep, line = '') {
    if (!metaStep) return line;
    const index = this.loggedMetaSteps.filter(ms => ms === line).length;
    line = `${metaStep.actor.replace(/[\W_]+/g, '') || ''}-${metaStep.name.replace(/[\W_]+/g, '') || ''}${index}_` + line;
    return this._stringifyMetaStep(metaStep.metaStep, line);
  }

  _mapStep({testStartedAt, id, step, snapshot, returnValue}) {
    assert(testStartedAt, 'testStartedAt is required');
    assert(id, 'id is required');
    assert(step, 'step is required');
  
    const stack = Object.assign({ stackFrameInTest: this.cachedStackFrameInTest }, filterStack(step));
    if (!stack.stackFrameInTest) {
      stack.stackFrameInTest = this.cachedStackFrameInTest;
    }
    this.cachedStackFrameInTest = stack.stackFrameInTest;

    return {
      id,
      testId: this.test.id,
      at: Date.now() - testStartedAt,
      duration: Date.now() - step.startTime,
      actor: 'I',
      humanized: step.humanize(),
      humanizedArgs: step.humanizeArgs(),
      name: step.name,
      args: mapArgs(step.args),
      store: Object.assign({}, store),
      snapshot,
      section: this._generateSection(step.metaStep),
      metaStep: this._mapMetaStep(step.metaStep),
      returnValue,
      command: step.command,
      stack
    }
  }
  
  async _emitSnapshot(helper, s, takeScreenshot = false) {
    if (this.nextForceTakeSnapshot) {
      this.debug('Previous step is forcing this snapshot', s.name);
    }

    let snapshot = this.savedSnapshot;
    if (this.nextForceTakeSnapshot || takeScreenshot || isSnapshotStep(s)) {
      snapshot = await takeSnapshot(helper, this.stepIndex, isScreenshotStep(s) || takeScreenshot);
    }

    // TODO Rather use return values in step.passed
    let returnValue;
    if (s.name.startsWith('grab')) {
      // Get the grabbed value
      returnValue = await helper[s.name](...s.args);
    }

    // TODO Change event name
    wsEvents.rtr.stepBefore(
      this._mapStep({
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
      // append changed metastep to list
      // NOTE this.metaStep can be null which means "no metastep"
      if (this.step.metaStep) wsEvents.rtr.metaStepChanged(this._mapMetaStep(this.step.metaStep, true));
      this.metaStep = this.step.metaStep;
    }
  }

  async _beforeStep(s) {
    if (!this._isEnabled(this.test)) return;

    this.stepIndex++;
    this.step = s; // store current step
    this.stepStartedAt = Date.now();

    this._emitMetaStepChangedIfNecessary();
  }

  async _beforeSuite(suite) {
    if (!this._isEnabled()) return;
    this.suite = suite;
   
    wsEvents.rtr.suiteBefore(mapSuiteAndTest(Date.now(), this.suite, this.test));
  }

  async _before(t) {
    if (!this._isEnabled(t)) return;

    t.retries(0); // disable retries in web ui
    this.test = t;
    this.testStartedAt = Date.now();
    this.stepIndex = 0;
    this.step = undefined;
    this.metaStep = undefined;
    this.loggedMetaSteps = [];
    this.cachedStackFrameInTest = undefined;

    wsEvents.rtr.testBefore(mapSuiteAndTest(this.testStartedAt, this.suite, this.test));
  }

  async _after(t) {
    if (!this._isEnabled(t)) return;

    wsEvents.rtr.testAfter(mapSuiteAndTest(this.testStartedAt, this.suite, this.test));
  }

  async _afterStep() {
    if (!this._isEnabled(this.test)) return;

    const helper = this._getHelper();
    await this._emitSnapshot(helper, this.step);
  }

  async _passed() {
    if (!this._isEnabled(this.test)) return;

    const helper = this._getHelper();

    // Make sure we always have a full snapshot on the last step
    const snapshot = await takeSnapshot(helper, this.stepIndex, true);

    wsEvents.rtr.testPassed({
      id: this.stepIndex,
      testStartedAt: this.testStartedAt,
      testId: this.test.id,
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
      testStartedAt: this.testStartedAt,
      testId: this.test.id,
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
