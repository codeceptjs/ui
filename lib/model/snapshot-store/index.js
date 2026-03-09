import Debug from 'debug';
const debug = Debug('codeceptjs:snapshot-store');
import assert from 'assert';
import fs from 'fs';
import path from 'path';

import fixHtmlSnapshot from './fix-html-snapshot.js';

const SnapshotBaseDir = path.join(global.output_dir || process.cwd(), '.ui', 'testruns');

const fixSnapshot = snapshot => {
  if (snapshot && snapshot.sourceContentType === 'html') {
    snapshot = fixHtmlSnapshot(snapshot);  
  }
  return snapshot; 
};

const fileNameFromId = id => `${id}.snapshots.json`;

// Maximum number of snapshots to keep in memory
const MAX_SNAPSHOTS = 500;

export default new class SnapshotStore {
  constructor() {
    this.steps = {};
    this._insertionOrder = [];
  }

  clear() {
    this.steps = {};
    this._insertionOrder = [];
  }

  add(id, snapshot) {
    assert(id, 'step id is required');
    assert(snapshot, 'snapshot is required');

    debug(`Adding step ${id}`);
    
    // If this is a new key, track insertion order
    if (!this.steps[id]) {
      this._insertionOrder.push(id);
    }
    
    this.steps[id] = fixSnapshot(snapshot);
    
    // Evict oldest entries if over limit
    while (this._insertionOrder.length > MAX_SNAPSHOTS) {
      const oldestId = this._insertionOrder.shift();
      delete this.steps[oldestId];
      debug(`Evicted snapshot ${oldestId} (store size exceeded ${MAX_SNAPSHOTS})`);
    }
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
    const snapshotData = fs.readFileSync(snapshotFile, 'utf8');
    this.steps = JSON.parse(snapshotData);
    this._insertionOrder = Object.keys(this.steps);
  }
};
