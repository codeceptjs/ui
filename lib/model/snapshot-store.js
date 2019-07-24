const assert = require('assert');
const _ = require('lodash');
const debug = require('debug')('codepress:snapshot-store');
const {URL} = require('url');

const extractBaseUrl = str => {
  const parsed = new URL(str);
  return `${parsed.protocol}//${parsed.host}${parsed.port ? ':' : ''}${parsed.port ? parsed.port : ''}`;
}

const extractUrlWithPath = str => {
  const parsed = new URL(str);
  const pathname = parsed.pathname[parsed.pathname.length - 1] === '/' ? parsed.pathname.slice(1, parsed.pathname.length - 1) : parsed.pathname;
  return `${parsed.protocol}//${parsed.hostname}${parsed.port ? ':' : ''}${parsed.port ? parsed.port : ''}/${pathname}`;
}

const fixHtmlSnapshot = step => {
  if (step.snapshot && step.snapshot.sourceContentType === 'html') {
    const pageBaseUrl = extractBaseUrl(step.snapshot.pageUrl);
    const pageUrlWithPath = extractUrlWithPath(step.snapshot.pageUrl);

    // Fix up css and script links
    let processedSource = step.snapshot.source;

    processedSource = processedSource.replace(/(href="\/)([^/])/gi, `href="${pageBaseUrl}/$2`); // hrefs starting with / or //
    processedSource = processedSource.replace(/(src="\/)([^/])/gi, `src="${pageBaseUrl}/$2`);

    // Case: <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
    // processedSource = processedSource.replace(/href="([^h][^t][^t][^p][^/]+)/gi, `href="${pageUrlWithPath}/$1`);

    // Disable all script tags
    processedSource = processedSource.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
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
