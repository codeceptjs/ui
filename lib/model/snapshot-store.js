const assert = require('assert');
const _ = require('lodash');
const debug = require('debug')('codepress:snapshot-store');
const {URL} = require('url');

const fixHtmlSnapshot = step => {
  if (step.snapshot && step.snapshot.sourceContentType === 'html') {
    const url = new URL(step.snapshot.pageUrl);

    // Fix up css and script links
    let processedSource = step.snapshot.source;
    processedSource = processedSource.replace(/href="([^/])/gi, `href="${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}${url.pathname}$1`);
    processedSource = processedSource.replace(/href="\/\//gi, `href="https://`);
    processedSource = processedSource.replace(/href="\//gi, `href="https://${url.hostname}/`);

    // TODO Fix this if it does not start with a / AND it does not start with http
    processedSource = processedSource.replace(/src="([^/h])/gi, `src="${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}${url.pathname}$1`);
    processedSource = processedSource.replace(/src="\/\//gi, `src="https://`);
    processedSource = processedSource.replace(/src="\//gi, `src="https://${url.hostname}/`);

    
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
