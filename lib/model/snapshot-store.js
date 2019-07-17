const assert = require('assert');
const _ = require('lodash');
const debug = require('debug')('codepress:snapshot-store');
const {URL} = require('url');

const extractBaseUrl = str => {
  const parsed = new URL(str);
  return `${parsed.protocol}//${parsed.host}${parsed.port ? ':' : ''}${parsed.port ? parsed.port : ''}`
}

const fixHtmlSnapshot = step => {
  if (step.snapshot && step.snapshot.sourceContentType === 'html') {
    const pageBaseUrl = extractBaseUrl(step.snapshot.pageUrl);

    // Fix up css and script links
    let processedSource = step.snapshot.source;

    processedSource = processedSource.replace(/(href="\/)([^\/])/gi, `href="${pageBaseUrl}/$2`)
    processedSource = processedSource.replace(/(src="\/)([^\/])/gi, `src="${pageBaseUrl}/$2`)
    // Disable all script tags
    processedSource = processedSource.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    step.snapshot.source = processedSource;  
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
    this.steps[id] = fixHtmlSnapshot(copyOfStep);

    // Remove snapshot data from original step (too big)
    if (step.snapshot) {
      debug('Removing snapshot data', step.snapshot.id);
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
