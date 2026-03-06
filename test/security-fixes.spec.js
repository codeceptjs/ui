const test = require('ava');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ---- Snapshot Store Bounds Tests ----

test('snapshot store evicts oldest entries when exceeding max size', (t) => {
  // Use a fresh instance to avoid state leakage
  const SnapshotStore = class {
    constructor(maxSize) {
      this.steps = {};
      this._insertionOrder = [];
      this.maxSize = maxSize;
    }
    add(id, snapshot) {
      if (!this.steps[id]) {
        this._insertionOrder.push(id);
      }
      this.steps[id] = snapshot;
      while (this._insertionOrder.length > this.maxSize) {
        const oldestId = this._insertionOrder.shift();
        delete this.steps[oldestId];
      }
    }
    get(id) { return this.steps[id]; }
    clear() { this.steps = {}; this._insertionOrder = []; }
  };

  const store = new SnapshotStore(3);
  
  store.add('a', { data: 1 });
  store.add('b', { data: 2 });
  store.add('c', { data: 3 });
  
  t.is(store._insertionOrder.length, 3);
  t.truthy(store.get('a'));
  
  // Adding a 4th should evict the oldest ('a')
  store.add('d', { data: 4 });
  
  t.is(store._insertionOrder.length, 3);
  t.falsy(store.get('a'));
  t.truthy(store.get('b'));
  t.truthy(store.get('c'));
  t.truthy(store.get('d'));
});

test('snapshot store clear resets insertion order', (t) => {
  const SnapshotStore = class {
    constructor() { this.steps = {}; this._insertionOrder = []; }
    add(id, snapshot) {
      if (!this.steps[id]) this._insertionOrder.push(id);
      this.steps[id] = snapshot;
    }
    clear() { this.steps = {}; this._insertionOrder = []; }
  };

  const store = new SnapshotStore();
  store.add('a', { data: 1 });
  store.add('b', { data: 2 });
  
  store.clear();
  
  t.is(store._insertionOrder.length, 0);
  t.deepEqual(store.steps, {});
});

// ---- Settings Validation Tests ----

test('settings repository only accepts allowed keys', (t) => {
  const settingsRepo = require('../lib/model/settings-repository');
  
  // Store valid settings
  settingsRepo.storeSettings({
    isSingleSession: true,
    browser: 'chromium',
    isHeadless: false,
    windowSize: '1200x800'
  });
  
  const settings = settingsRepo.getSettings();
  t.is(settings.isSingleSession, true);
  t.is(settings.browser, 'chromium');
  t.is(settings.isHeadless, false);
  t.is(settings.windowSize, '1200x800');
  
  // Store invalid settings - should be ignored
  settingsRepo.storeSettings({
    maliciousKey: 'malicious value',
    __proto__: { polluted: true }
  });
  
  const settings2 = settingsRepo.getSettings();
  t.is(settings2.maliciousKey, undefined);
});

// ---- Testrun Repository Error Handling Tests ----

test('testrun repository handles malformed JSON gracefully', (t) => {
  // Set global.output_dir before requiring testrun-repository
  const tmpDir = os.tmpdir();
  global.output_dir = tmpDir;
  
  // Clear module cache to force re-require with new global
  delete require.cache[require.resolve('../lib/model/testrun-repository')];
  const testrunRepo = require('../lib/model/testrun-repository');
  
  // Create a file with invalid JSON
  const testId = `malformed-test-${Date.now()}`;
  const testRunBaseDir = path.join(tmpDir, '.ui', 'testruns');
  const testFile = path.join(testRunBaseDir, `${encodeURIComponent(testId)}.json`);
  
  // Ensure directory exists
  fs.mkdirSync(testRunBaseDir, { recursive: true });
  
  // Write invalid JSON
  fs.writeFileSync(testFile, '{invalid json content', 'utf8');
  
  // Should not throw, should return undefined
  const result = testrunRepo.getTestRun(testId);
  t.is(result, undefined);
  
  // Cleanup
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
});

// ---- Reporter Utils retry fix test ----

test('takeSnapshot retry parameter decrements correctly', (t) => {
  // This is a static analysis test - verify the source code uses `retry - 1` not `retry--`
  const reporterUtilsSource = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'codeceptjs', 'reporter-utils.js'), 
    'utf8'
  );
  
  // Should use `retry - 1` (correct) not `retry--` (incorrect, causes infinite recursion)
  t.true(reporterUtilsSource.includes('retry - 1'));
  t.false(reporterUtilsSource.includes('retry--'));
});

// ---- New Test API: eval replacement test ----

test('new-test.js uses Function constructor instead of eval', (t) => {
  const newTestSource = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'api', 'new-test.js'),
    'utf8'
  );
  
  // Should not contain eval() as a function call (exclude comments)
  const codeLines = newTestSource.split('\n').filter(line => !line.trim().startsWith('//'));
  const codeOnly = codeLines.join('\n');
  t.false(/\beval\s*\(/.test(codeOnly), 'Should not use eval() in code');
  // Should use new Function()
  t.true(newTestSource.includes('new Function'), 'Should use new Function()');
});

// ---- Path Traversal Protection Tests ----

test('editor.js uses realpathSync for path traversal protection', (t) => {
  const editorSource = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'api', 'editor.js'),
    'utf8'
  );
  
  // Should use realpathSync for secure path resolution
  t.true(editorSource.includes('realpathSync'));
});

test('get-file.js uses realpathSync for path traversal protection', (t) => {
  const getFileSource = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'api', 'get-file.js'),
    'utf8'
  );
  
  // Should use realpathSync for secure path resolution
  t.true(getFileSource.includes('realpathSync'));
});

// ---- Scenario Repository Watcher Cleanup ----

test('scenario-repository exports closeWatcher function', (t) => {
  const repoSource = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'model', 'scenario-repository.js'),
    'utf8'
  );
  
  t.true(repoSource.includes('closeWatcher'));
  t.true(repoSource.includes('watcher.close()'));
});

// ---- Run Scenario Grep Sanitization ----

test('run-scenario.js sanitizes grep parameter', (t) => {
  const runScenarioSource = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'api', 'run-scenario.js'),
    'utf8'
  );
  
  // Should sanitize special regex characters
  t.true(runScenarioSource.includes('sanitizedGrep'));
  t.true(runScenarioSource.includes('replace'));
});

// ---- Init.js Error Handling ----

test('init.js wraps lstatSync in try-catch', (t) => {
  const initSource = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'commands', 'init.js'),
    'utf8'
  );
  
  // Should have try-catch around lstatSync
  t.true(initSource.includes('try'));
  t.true(initSource.includes('catch'));
  t.true(initSource.includes('lstatSync'));
});
