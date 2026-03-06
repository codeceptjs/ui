import Debug from 'debug';
const debug = Debug('codeceptjs:testRunRepository');
import fs from 'fs';
import path from 'path';
import mkdir from '../utils/mkdir.js';

mkdir(path.join(global.output_dir, '.ui'));
const TestRunBaseDir = path.join(global.output_dir, '.ui', 'testruns');
mkdir(TestRunBaseDir);

const fileNameFromId = id => `${encodeURIComponent(id)}.json`;

export default {
  saveTestRun(id, testRun) {
    debug(`Saving testrun ${id}`);
    fs.writeFileSync(path.join(TestRunBaseDir, fileNameFromId(id)), JSON.stringify(testRun), 'utf8');
  },

  getTestRun(id) {
    const testRunFile = path.join(TestRunBaseDir, fileNameFromId(id));
    if (!fs.existsSync(testRunFile)) return;

    debug(`Retrieving testrun ${id}`);
    try {
      const testRunAsString = fs.readFileSync(testRunFile, 'utf8');
      return JSON.parse(testRunAsString);
    } catch (err) {
      debug(`Error reading testrun ${id}:`, err.message);
      return undefined;
    }
  }
};