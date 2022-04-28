const debug = require('debug')('codeceptjs:snapshot-store');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const fixHtmlSnapshot = require('./fix-html-snapshot');

const SnapshotBaseDir = path.join(global.output_dir || process.cwd(), '.ui', 'testruns');

const fixSnapshot = snapshot => {
  if (snapshot && snapshot.sourceContentType === 'html') {
    snapshot = fixHtmlSnapshot(snapshot);  
  }
  return snapshot; 
};

const fileNameFromId = id => `${id}.snapshots.json`;

module.exports = new class SnapshotStore {
  constructor() {
    this.steps = {};
  }

  clear() {
    this.steps = {};
  }

  add(id, snapshot) {
    assert(id, 'step id is required');
    assert(snapshot, 'snapshot is required');

    debug(`Adding step ${id}`);
    
    this.steps[id] = fixSnapshot(snapshot);
  }

  get(id) {
    return this.steps[id];
  }

  exists(id) {
    return this.steps[id] !== undefined;
  }

  hasSnapshot(id) {
    return this.exists(id) && this.get(id);
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
