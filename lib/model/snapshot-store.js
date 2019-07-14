const {URL} = require('url');

const fixHtmlSnapshot = step => {
  if (step.snapshot && step.snapshot.sourceContentType === 'html') {
    const url = new URL(step.snapshot.pageUrl);

    // Fix up css and script links
    let processedSource = step.snapshot.source;
    processedSource = processedSource.replace(/href="([^\/])/gi, `href="${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}${url.pathname}$1`);
    processedSource = processedSource.replace(/href="\/\//gi, `href="https://`);
    processedSource = processedSource.replace(/href="\//gi, `href="https://${url.hostname}/`);
  
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
    this.steps[id] = fixHtmlSnapshot(step);
    return this.steps[id];
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
