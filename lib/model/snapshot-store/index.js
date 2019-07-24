const assert = require('assert');
const _ = require('lodash');
const fixHtmlSnapshot = require('./fix-html-snapshot');

const fixStep = step => {
  if (step.snapshot && step.snapshot.sourceContentType === 'html') {
    step.snapshot = fixHtmlSnapshot(step.snapshot);  
  }
  return step; 
}

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

    const copyOfStep = _.cloneDeep(step);
    this.steps[id] = fixStep(copyOfStep);

    // Remove snapshot data from original step (too big)
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
}
