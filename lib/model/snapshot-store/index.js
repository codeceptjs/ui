const debug = require('debug')('codepress:snapshot-store');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cloneDeep = require('lodash.clonedeep');

const fixHtmlSnapshot = require('./fix-html-snapshot');

const SnapshotBaseDir = path.join('.', '.codepress', 'testruns');

const fixStep = step => {
  if (step.snapshot && step.snapshot.sourceContentType === 'html') {
    step.snapshot = fixHtmlSnapshot(step.snapshot);  
  }
  return step; 
};

const fileNameFromId = id => `${id}.snapshots.json`;

module.exports = new class SnapshotStore {
  constructor() {
    this.steps = {};
  }

  clear() {
    this.steps = {};
  }

  add(id, step) {
    assert(id, 'step is is required');
    assert(step, 'step is required');

    debug(`Adding step ${id}`);
    
    const copyOfStep = cloneDeep(step);
    this.steps[id] = fixStep(copyOfStep);

    // Remove snapshot data from original step (too big) before proxying to frontend
    if (step.snapshot) {
      step.snapshot.hasScreenshot = step.snapshot.screenshot !== undefined;
      step.snapshot.screenshot = undefined;
      step.snapshot.hasSource = step.snapshot.source !== undefined;
      step.snapshot.source = undefined;
    }
    return step;
  }

  get(id) {
    return this.steps[id];
  }

  exists(id) {
    return this.steps[id] !== undefined;
  }

  hasSnapshot(id) {
    return this.exists(id) && this.get(id).snapshot;
  }

  saveWithTestRun(testRunId) {
    const snapshotFile = path.join(SnapshotBaseDir, fileNameFromId(testRunId));

    debug(`Saving snapshots to ${snapshotFile}`);

    fs.writeFileSync(snapshotFile, JSON.stringify(this.steps), 'utf8');
  }

  restoreFromTestRun(testRunId) {
    const snapshotFile = path.join(SnapshotBaseDir, fileNameFromId(testRunId));
    if (!fs.existsSync(snapshotFile)) return;

    debug(`Retrieving snapshot for testrun ${testRunId}`);
    const snapshotData = fs.readFileSync(snapshotFile);
    this.steps = JSON.parse(snapshotData);
  }
};
