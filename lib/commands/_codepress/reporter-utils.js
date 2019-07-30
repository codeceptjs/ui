const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const toString = sth => {
  if (typeof sth === 'string') return sth
  if (typeof sth === 'object') return JSON.stringify(sth)
  return '' + sth
}
const toError = err => {
  assert(err, 'err is required');

  let message = err.message;
  if (err.inspect) { // AssertionFailedError
    message = err.message = err.inspect()
  }
  message = toString(message)

  return {
    name: err.name,
    message,
    hash: hashString(message, err.stack),
    stack: err.stack,
    actual: err.actual,
    expected: err.expected,
    operator: err.operator
  }
}

const hashString = (...args) => {
  const str = args.join('-')
  const hash = crypto.createHash('sha1');
  hash.setEncoding('hex');
  hash.write(str);
  hash.end();
  return hash.read();
}

const isSnapshotStepBefore = (step) => {
  if (step.name.startsWith('click') || step.name.startsWith('double')) return true;
  if (step.name.indexOf('switch') >= 0) return true; // trigger a force snapshot on the next step
  return false;
}

const isSnapshotStep = (step) => {
  if (step.name.startsWith('click') || step.name.startsWith('double')) return true;
  if (step.name.indexOf('tap') >= 0) return true;
  if (step.name.indexOf('see') >= 0) return true;
  if (step.name.indexOf('dontSee') >= 0) return true;
  if (step.name.indexOf('swipe') >= 0) return true;
  if (step.name.indexOf('fillField') >= 0) return true;
  if (step.name.indexOf('selectOption') >= 0) return true;
  if (step.name.indexOf('amOnPage') >= 0) return true;
  if (step.name.indexOf('saveScreenshot') >= 0) return true;
  return false;
}

const isScreenshotStep = (step) => {
  // TODO Better use existing screenshot from saveScreenshot
  if (step.name.indexOf('saveScreenshot') >= 0) return true;
  return false;
}

/**
 * Grab html source from current iframe
 */
const grabSource = async helper => {
  // TODO This is puppeteer specific, so make that work with other helpers
  if (helper.context && helper.context.content) {
    return helper.context.content();
  }
  return helper.grabSource();
}

const takeSnapshot = async (helper, snapshotId, takeScreenshot = false) => {
  assert(helper, 'helper is required');
  assert(snapshotId, 'snapshotId is required');

  const HelperName = helper.constructor.name;
  const StepFileName = '_step_screenshot.png';

  let source, pageUrl, pageTitle, scrollPosition;

  // TODO catch errors and retry?
  [_, source, pageUrl, pageTitle, scrollPosition] = await Promise.all([
      takeScreenshot ? helper.saveScreenshot(StepFileName) : Promise.resolve(undefined),
      grabSource(helper),
      helper.grabCurrentActivity ? await helper.grabCurrentActivity() : await helper.grabCurrentUrl(),
      helper.grabTitle(),
      helper.grabPageScrollPosition()
  ]);

  const snapshot = {
    id: snapshotId,
    screenshot: takeScreenshot ? fs.readFileSync(path.join(global.output_dir, StepFileName)) : undefined,
    scrollPosition,
    source,
    sourceContentType: HelperName === 'Appium' ? 'xml' : 'html',
    pageUrl,
    pageTitle
  };

  return snapshot;
}

module.exports = {
  toString,
  toError,
  hashString,
  isSnapshotStep,
  isSnapshotStepBefore,
  isScreenshotStep,
  takeSnapshot
}
