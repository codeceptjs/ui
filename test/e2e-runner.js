#!/usr/bin/env node
/**
 * E2E test runner for CodeceptJS 4.x ESM integration.
 *
 * This script is executed as a subprocess by the AVA test because AVA workers
 * cannot call process.chdir() (needed by codeceptjs-factory).
 *
 * It boots the full CodeceptUI stack against an ESM fixture project and emits
 * a JSON report on stdout.
 */
import path from 'path';
import express from 'express';
import http from 'http';

const FIXTURE_DIR = path.join(import.meta.dirname, 'e2e-esm');

// chdir to the ESM fixture — the factory resolves config relative to cwd
process.chdir(FIXTURE_DIR);

// Set test environment to avoid socket connections
process.env.NODE_ENV = 'test';

const results = {
  modulesLoaded: false,
  configLoaded: false,
  configName: null,
  helpersLoaded: [],
  suitesLoaded: 0,
  scenarioTitles: [],
  apiScenariosOk: false,
  apiConfigOk: false,
  apiSettingsOk: false,
  configReloadOk: false,
  helperFactoryOk: false,
  subpathImportOk: false,
  errors: [],
};

async function run() {
  // 1. Test ESM module loading
  try {
    const { codeceptjsModules, importSubpath } = await import('../lib/codeceptjs/codeceptjs-imports.js');
    const modules = await codeceptjsModules();
    results.modulesLoaded = !!(
      modules.Codecept && modules.container && modules.config &&
      modules.event && modules.recorder && modules.output && modules.Helper
    );

    // Test subpath import
    try {
      const testModule = await importSubpath('codeceptjs/lib/mocha/test');
      results.subpathImportOk = !!testModule;
    } catch (err) {
      results.errors.push(`subpath import: ${err.message}`);
    }
  } catch (err) {
    results.errors.push(`module loading: ${err.message}`);
  }

  // 2. Test factory initialization with ESM config
  let factory;
  try {
    const factoryModule = await import('../lib/model/codeceptjs-factory.js');
    factory = factoryModule.default;
    await factory.create({}, {});

    const { config, container } = factory.getInstance();
    results.configLoaded = true;
    results.configName = config.get('name');
    results.helpersLoaded = Object.keys(container.helpers());

    // 3. Test helper factory pattern
    const helpers = container.helpers();
    const reporter = helpers.RealtimeReporterHelper;
    results.helperFactoryOk = !!(
      reporter &&
      typeof reporter._init === 'function' &&
      typeof reporter._before === 'function'
    );
  } catch (err) {
    results.errors.push(`factory init: ${err.message}`);
  }

  // 4. Test scenario loading
  if (factory) {
    try {
      const suites = factory.reloadSuites();
      results.suitesLoaded = suites.length;
      results.scenarioTitles = suites.flatMap(s => s.tests.map(t => t.title));
    } catch (err) {
      results.errors.push(`scenario loading: ${err.message}`);
    }
  }

  // 5. Test API layer
  if (factory) {
    try {
      const apiModule = await import('../lib/api/index.js');
      const api = apiModule.default;
      const app = express();
      app.use('/api', api);

      const server = http.createServer(app);
      await new Promise(resolve => server.listen(0, resolve));
      const port = server.address().port;

      // Test /api/scenarios
      try {
        const scenariosRes = await fetch(`http://localhost:${port}/api/scenarios`);
        const scenariosData = await scenariosRes.json();
        results.apiScenariosOk = !!(scenariosData.features && scenariosData.name === 'e2e-esm-tests');
      } catch (err) {
        results.errors.push(`api/scenarios: ${err.message}`);
      }

      // Test /api/config
      try {
        const configRes = await fetch(`http://localhost:${port}/api/config`);
        const configData = await configRes.json();
        results.apiConfigOk = !!(
          configData.config && configData.helpers &&
          configData.file === 'codecept.conf.js' &&
          configData.helpers.includes('Playwright')
        );
      } catch (err) {
        results.errors.push(`api/config: ${err.message}`);
      }

      // Test /api/settings
      try {
        const settingsRes = await fetch(`http://localhost:${port}/api/settings`);
        const settingsData = await settingsRes.json();
        results.apiSettingsOk = typeof settingsData === 'object' && settingsData !== null;
      } catch (err) {
        results.errors.push(`api/settings: ${err.message}`);
      }

      server.close();
    } catch (err) {
      results.errors.push(`api layer: ${err.message}`);
    }
  }

  // 6. Test config reload (async in 4.x)
  if (factory) {
    try {
      await factory.reloadConfig();
      const { config } = factory.getInstance();
      results.configReloadOk = config.get('name') === 'e2e-esm-tests';
    } catch (err) {
      results.errors.push(`config reload: ${err.message}`);
    }
  }

  // Emit results as JSON on a tagged line for the AVA test to parse
  console.log('E2E_RESULTS:' + JSON.stringify(results));

  // Force exit — chokidar watcher and other resources may keep the process alive
  process.exit(0);
}

run().catch(err => {
  results.errors.push(`top-level: ${err.message}`);
  console.log('E2E_RESULTS:' + JSON.stringify(results));
  process.exit(1);
});
