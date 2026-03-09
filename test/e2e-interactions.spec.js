import test from 'ava';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFileAsync = promisify(execFile);

/**
 * E2E interaction tests — exercises actual CodeceptUI actions against an ESM
 * fixture project and captures proof screenshots (JSON response snapshots).
 *
 * Tests cover:
 *  - Scenario listing (via repository), individual fetch, search/filter by query and tag
 *  - Config inspection (helpers, plugins, file, full config)
 *  - Settings save/restore round-trip
 *  - Scenario status tracking
 *  - Stop scenario (graceful, no active runner)
 *  - Run scenario dispatch
 *  - Ports endpoint
 *
 * Runs as a subprocess because the factory needs process.chdir().
 */

let results;

test.before(async () => {
  const runner = path.join(import.meta.dirname, 'e2e-interaction-runner.js');
  const { stdout, stderr } = await execFileAsync(
    process.execPath,
    [runner],
    { timeout: 60_000, env: { ...process.env, NODE_ENV: 'test' } }
  );

  const match = stdout.match(/^E2E_INTERACTION_RESULTS:(.+)$/m);
  if (!match) {
    throw new Error(`e2e-interaction-runner did not emit results.\nstdout: ${stdout}\nstderr: ${stderr}`);
  }
  results = JSON.parse(match[1]);
});

// ──────────────────────────────────────────────
// Scenario Listing (via repository, first load)
// ──────────────────────────────────────────────

test.serial('scenario list loads all features from ESM test files', t => {
  t.true(results.scenarioListHasMultipleFeatures,
    `Should have >= 3 features, got ${results.scenarioListCount}`);
});

test.serial('each feature has correct structure with scenarios', t => {
  t.true(results.scenarioListHasCorrectStructure,
    'Each feature should have title and non-empty scenarios array');
});

// ──────────────────────────────────────────────
// Individual Scenario Fetch
// ──────────────────────────────────────────────

test.serial('individual scenario fetch returns scenario with title', t => {
  t.true(results.scenarioFetchById,
    'Should return scenario with a title');
});

test.serial('fetched scenario includes test body', t => {
  t.true(results.scenarioFetchByIdHasBody,
    'Scenario body should be a non-empty string');
});

// ──────────────────────────────────────────────
// Scenario Search & Filter
// ──────────────────────────────────────────────

test.serial('search for "login" returns matching features', t => {
  t.true(results.scenarioSearchMatch,
    'Should find features containing "login" in title');
});

test.serial('search for non-existent term returns empty', t => {
  t.true(results.scenarioSearchNoMatch,
    'Should return no features for non-matching query');
});

test.serial('search by @smoke tag finds tagged features', t => {
  t.true(results.scenarioSearchByTag,
    'Should find features tagged with @smoke');
});

// ──────────────────────────────────────────────
// API /scenarios endpoint
// ──────────────────────────────────────────────

test.serial('GET /api/scenarios returns valid response structure', t => {
  t.true(results.apiScenariosEndpointOk,
    'Should return 200 with {name, features} structure');
});

// ──────────────────────────────────────────────
// Config Inspection
// ──────────────────────────────────────────────

test.serial('GET /api/config returns Playwright in helpers', t => {
  t.true(results.configHasHelpers,
    'Config should list Playwright as a helper');
});

test.serial('GET /api/config returns plugins array', t => {
  t.true(results.configHasPlugins,
    'Config should include a plugins array');
});

test.serial('GET /api/config returns correct config file name', t => {
  t.true(results.configHasFile,
    'Config file should be codecept.conf.js');
});

test.serial('GET /api/config returns full config with project name', t => {
  t.true(results.configHasFullConfig,
    'Full config should contain name "e2e-esm-tests"');
});

// ──────────────────────────────────────────────
// Settings Save / Restore Round-Trip
// ──────────────────────────────────────────────

test.serial('GET /api/settings returns settings object', t => {
  t.true(results.settingsGet, 'Should return 200 with settings object');
});

test.serial('PUT /api/settings + GET verifies round-trip persistence', t => {
  t.true(results.settingsSaveRestore,
    'Settings saved (editor=vscode, isSingleSession=true) should be readable back');
});

// ──────────────────────────────────────────────
// Scenario Status
// ──────────────────────────────────────────────

test.serial('GET /api/scenario-status returns status object', t => {
  t.true(results.scenarioStatusGet, 'Should return 200');
});

test.serial('scenario status is a valid object', t => {
  t.true(results.scenarioStatusIsObject, 'Status should be a non-null object');
});

// ──────────────────────────────────────────────
// Stop Scenario (no active runner)
// ──────────────────────────────────────────────

test.serial('POST /api/scenarios/stop returns OK when no runner active', t => {
  t.true(results.stopNoRunner,
    'Stop should gracefully handle no active runner');
});

// ──────────────────────────────────────────────
// Run Scenario
// ──────────────────────────────────────────────

test.serial('POST /api/scenarios/grep/:grep/run dispatches execution', t => {
  t.true(results.runScenarioDispatched,
    'Run endpoint should return 200 OK to start execution');
});

// ──────────────────────────────────────────────
// Ports Endpoint
// ──────────────────────────────────────────────

test.serial('GET /api/ports returns port and wsPort numbers', t => {
  t.true(results.portsEndpoint,
    'Should return { port: number, wsPort: number }');
});

// ──────────────────────────────────────────────
// Proof Screenshots Saved
// ──────────────────────────────────────────────

test.serial('proof screenshots are captured for all interactions', t => {
  t.true(results.proofsSaved.length >= 13,
    `Should have saved at least 13 proof files, got ${results.proofsSaved.length}`);

  // Verify proof files exist on disk
  const screenshotsDir = path.join(import.meta.dirname, 'e2e-esm', 'output', 'screenshots');
  for (const proof of results.proofsSaved) {
    const filePath = path.join(screenshotsDir, proof);
    t.true(fs.existsSync(filePath), `Proof file ${proof} should exist`);
  }
});

// ──────────────────────────────────────────────
// Error Summary
// ──────────────────────────────────────────────

test.serial('no errors during interaction tests', t => {
  t.deepEqual(results.errors, [], 'Should have no errors');
});
