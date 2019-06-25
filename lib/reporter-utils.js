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

const isSnapshotStep = (step) => {
  if (step.name.indexOf('click') >= 0) return true;
  if (step.name.indexOf('tap') >= 0) return true;
  if (step.name.indexOf('see') >= 0) return true;
  if (step.name.indexOf('waitForVisible') >= 0) return true;
  if (step.name.indexOf('swipe') >= 0) return true;
  if (step.name.indexOf('grab') >= 0) return true;
  if (step.name.indexOf('fillField') >= 0) return true;
  if (step.name.indexOf('amOnPage') >= 0) return true;
  return false;
}

const takeSnapshot = async (helper) => {
  assert(helper, 'helper is required');

  const HelperName = helper.constructor.name;
  const StepFileName = '_step_screenshot.png';

  const source = await helper.grabSource();
  const pageUrl = await helper.grabCurrentActivity ? helper.grabCurrentActivity() : helper.grabCurrentUrl();
  const pageTitle = await helper.grabTitle();
  await helper.saveScreenshot(StepFileName);

  const snapshot = {
    screenshot: fs.readFileSync(path.join(global.output_dir, StepFileName)),
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
  takeSnapshot
}
