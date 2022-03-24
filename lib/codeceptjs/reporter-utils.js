const debug = require('debug')('codeceptjs:reporter-utils');
const assert = require('assert');
const crypto = require('crypto');

const toString = sth => {
  if (typeof sth === 'string') return sth;
  if (typeof sth === 'object') return JSON.stringify(sth);
  return '' + sth;
};
const toError = err => {
  assert(err, 'err is required');

  let message = err.message;
  if (err.inspect) { // AssertionFailedError
    message = err.message = err.inspect();
  }
  message = toString(message);

  return {
    name: err.name,
    message,
    hash: hashString(message, err.stack),
    stack: err.stack,
    actual: err.actual,
    expected: err.expected,
    operator: err.operator
  };
};

const hashString = (...args) => {
  const str = args.join('-');
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  hash.write(str);
  hash.end();
  return hash.read();
};

const isSnapshotStepBefore = (step) => {
  if (step.name.startsWith('click') || step.name.startsWith('double')) return true;
  if (step.name.startsWith('switch')) return true; // trigger a force snapshot on the next step
  if (step.name.startsWith('scroll')) return true; // make sure we have a screenshot after the scroll
  return false;
};

const isSnapshotStep = () => { // step
  // which steps to ignore?
  return true;
};

const isRetvalStep = step => {
  // TODO Need to map retrun values (e. g. axios responses)
  if (step.name.startsWith('send')) return true;
  if (step.name.startsWith('grab')) return true;
  return false;
};

const getRetval = async (step, retvalPromise) => {
  let retval;
  if (retvalPromise) {

    try {
      retval = await retvalPromise;
      if (retval) {
        if (step.name.startsWith('send')) {
          retval = retval.data;
        }
      }
    } catch (err) {
      debug('ERROR getting retval in step', step.name);
    }
  }
  return retval;
};

const isScreenshotStep = (step) => {
  if (step.name.match(/^wait/)) return true;
  if (step.name.match(/click/)) return true;
  if (step.name.match(/screenshot/)) return true;
  if (step.name.match(/^see/)) return true;
  if (step.name.match(/^dontSee/)) return true;
  return ['amOnPage', 'fillField', 'appendField', 'pressKey'].includes(step.name);
};

/**
 * Grab html source from current iframe
 */
const grabSource = async helper => {
  if (!helper.isRunning) return;
  try {
    return helper.grabSource();
  } catch (err) {
    debug('Failed to grab source', err);
  }
};

const getViewportSize = function() {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)    
  };
};

/**
 * Save screenshot and catch errors
 * @param {*} helper 
 * @param {*} filename 
 */
const saveScreenshot = async (helper, filename) => {
  try{
    return helper.saveScreenshot(filename);
  } catch (err) {
    debug('Failed to save screenshot', err);
  }
};

/**
 * Take an HTML snapshot
 * @param {*} helper 
 * @param {*} snapshotId 
 * @param {*} takeScreenshot 
 */
const takeSnapshot = async (helper, snapshotId, takeScreenshot = false, retry = 3) => {
  assert(helper, 'helper is required');
  assert(snapshotId, 'snapshotId is required');

  const HelperName = helper.constructor.name;
  const StepFileName = snapshotId + '_step_screenshot.png';

  let _, pageUrl, pageTitle, scrollPosition, viewportSize; // eslint-disable-line no-unused-vars

  try {
    [_, pageUrl, pageTitle, scrollPosition, viewportSize] = await Promise.all([
      takeScreenshot ? saveScreenshot(helper, StepFileName) : Promise.resolve(undefined),
      helper.grabCurrentActivity ? helper.grabCurrentActivity() : helper.grabCurrentUrl(),
      helper.grabTitle ? helper.grabTitle() : '',
      helper.grabPageScrollPosition(),
      helper.executeScript(getViewportSize),
    ]);
  
    const snapshot = {
      id: snapshotId,
      screenshot: takeScreenshot ? StepFileName : undefined,
      scrollPosition,
      sourceContentType: HelperName === 'Appium' ? 'xml' : 'html',
      pageUrl,
      pageTitle,
      viewportSize,
    };
  
    return snapshot;    
  } catch (err) {
    if (retry > 0) {
      await new Promise(done => setTimeout(done, 100));
      debug('Retrying snapshot taking');
      return takeSnapshot(helper, snapshotId, takeScreenshot, retry--);
    }
    debug('ERROR Exception in takeSnapshot', err);

    return {};
  }
};

/**
 * Filter step stacktrace
 */
const filterStack = step => {
  const stackFrames = step.stack.split('\n');
  const stackFramesOfProject = stackFrames
    .filter(sf => sf && sf.includes(process.cwd())) // keep only stackframes pointing to source within the test project
  ; 

  const cwd = process.cwd();

  return {
    stackFrameOfStep: stackFramesOfProject.find(sf => sf.includes(cwd)),
    stackFrameInTest: stackFramesOfProject.find(sf => sf.includes('Test.Scenario') || sf.includes('Test.<anonymous>'))
  };
};

/**
 * Safe version of stringify to serialize circular objects
 */
const stringifySafe = (o) => {
  let cache = [];
  const ret = JSON.stringify(o, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // Enable garbage collection
  return ret;
};

module.exports = {
  toString,
  toError,
  grabSource,
  hashString,
  isRetvalStep,
  getRetval,
  isSnapshotStep,
  isSnapshotStepBefore,
  isScreenshotStep,
  takeSnapshot,
  filterStack,
  stringifySafe
};
