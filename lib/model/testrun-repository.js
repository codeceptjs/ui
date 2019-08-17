const debug = require('debug')('codepress:testRunRepository');
const fs = require('fs');
const path = require('path');
const mkdir = require('../utils/mkdir');

mkdir(path.join('.', '.codepress'));
const TestRunBaseDir = path.join('.', '.codepress', 'testruns');
mkdir(TestRunBaseDir);

module.exports = {
  saveTestRun(id, testRun) {
    debug(`Saving testrun ${id}`);
    fs.writeFileSync(path.join(TestRunBaseDir, `${id}.json`), JSON.stringify(testRun), 'utf8');
  },

  getTestRun(id) {
    const testRunFile = path.join(TestRunBaseDir, `${id}.json`);
    if (!fs.existsSync(testRunFile)) return;

    debug(`Retrieving testrun ${id}`);
    const testRunAsString = fs.readFileSync(testRunFile);
    return JSON.parse(testRunAsString);
  }
}