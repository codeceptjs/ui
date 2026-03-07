import test from 'ava';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

/**
 * E2E integration tests that verify CodeceptUI works with CodeceptJS 4.x ESM.
 *
 * The runner script (e2e-runner.js) boots the full CodeceptUI stack against
 * an ESM fixture project ("type": "module", `export const config = { ... }`)
 * and exercises the API layer. It outputs a JSON report which is parsed here
 * for individual assertions.
 *
 * This runs as a subprocess because the factory needs process.chdir(),
 * which is not available in AVA worker threads.
 */

let results;

test.before(async () => {
  const runner = path.join(import.meta.dirname, 'e2e-runner.js');
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    [runner],
    { timeout: 60_000, env: { ...process.env, NODE_ENV: 'test' } }
  );

  // Parse the JSON results from the tagged output line
  const match = stdout.match(/^E2E_RESULTS:(.+)$/m);
  if (!match) {
    throw new Error(`e2e-runner did not emit results.\nstdout: ${stdout}\nstderr: ${stderr}`);
  }
  results = JSON.parse(match[1]);
});

// ──────────────────────────────────────────────
// CodeceptJS 4.x ESM Module Loading
// ──────────────────────────────────────────────

test.serial('codeceptjs 4.x ESM modules are importable', (t) => {
  t.true(results.modulesLoaded,
    'Codecept, container, config, event, recorder, output, Helper should all be available');
});

test.serial('codeceptjs subpath import works', (t) => {
  t.true(results.subpathImportOk,
    'Should be able to import codeceptjs/lib/mocha/test via ESM');
});

// ──────────────────────────────────────────────
// Factory Initialization with ESM Config
// ──────────────────────────────────────────────

test.serial('factory loads ESM config (export const config)', (t) => {
  t.true(results.configLoaded, 'Factory should initialize successfully');
  t.is(results.configName, 'e2e-esm-tests', 'Config name should come from ESM fixture');
});

test.serial('container creates helpers including Playwright', (t) => {
  t.true(results.helpersLoaded.includes('Playwright'), 'Playwright helper should be present');
  t.true(results.helpersLoaded.includes('RealtimeReporterHelper'), 'Internal helpers should load');
  t.true(results.helpersLoaded.includes('SingleSessionHelper'), 'SingleSessionHelper should load');
});

test.serial('helper factory pattern produces valid helper instances', (t) => {
  t.true(results.helperFactoryOk,
    'Helpers should have _init and _before methods from Helper base class');
});

// ──────────────────────────────────────────────
// Scenario Loading from ESM Test Files
// ──────────────────────────────────────────────

test.serial('scenarios are loaded from ESM test files', (t) => {
  t.is(results.suitesLoaded, 1, 'Should load one suite from the fixture');
  t.true(results.scenarioTitles.length >= 2, 'Suite should have at least 2 scenarios');
});

test.serial('scenario titles are parsed correctly', (t) => {
  t.true(results.scenarioTitles.includes('sample test'), 'Should find "sample test"');
  t.true(results.scenarioTitles.includes('another test'), 'Should find "another test"');
});

// ──────────────────────────────────────────────
// API Layer (Express Routes)
// ──────────────────────────────────────────────

test.serial('GET /api/scenarios returns scenarios from ESM project', (t) => {
  t.true(results.apiScenariosOk,
    'API should return features with the correct config name');
});

test.serial('GET /api/config returns ESM config with Playwright helper', (t) => {
  t.true(results.apiConfigOk,
    'API should return config object with Playwright in helpers list');
});

test.serial('GET /api/settings returns settings object', (t) => {
  t.true(results.apiSettingsOk, 'API should return a settings object');
});

// ──────────────────────────────────────────────
// Config Reload (async in CodeceptJS 4.x)
// ──────────────────────────────────────────────

test.serial('reloadConfig works with ESM config', (t) => {
  t.true(results.configReloadOk,
    'Config should reload successfully and retain name');
});

// ──────────────────────────────────────────────
// Error summary
// ──────────────────────────────────────────────

test.serial('no errors during e2e run', (t) => {
  t.deepEqual(results.errors, [], 'Should have no errors');
});
