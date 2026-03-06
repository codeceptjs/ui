/**
 * ESM-CJS Interop helper for CodeceptJS 4.x
 * 
 * CodeceptJS 4.x moved to ESM ("type": "module" in package.json).
 * Since CodeceptUI remains CommonJS, we use dynamic import() to load
 * CodeceptJS modules. This module provides a cached lazy accessor
 * that resolves on first use and caches for subsequent access.
 * 
 * Usage:
 *   const { codeceptjsModules } = require('./codeceptjs-imports');
 *   // ... later, in an async context:
 *   const { event, container, config, ... } = await codeceptjsModules();
 */

let _loaded;

/**
 * Dynamically import all CodeceptJS modules.
 * Returns a cached promise so they're only loaded once.
 * @returns {Promise<{
 *   codecept: Function,
 *   Codecept: Function,
 *   container: object,
 *   config: object,
 *   event: object,
 *   recorder: object,
 *   output: object,
 *   store: object,
 *   Helper: Function,
 *   secret: Function,
 * }>}
 */
function codeceptjsModules() {
  if (!_loaded) {
    _loaded = import('codeceptjs').then(mod => {
      const codeceptjs = mod.default || mod;
      return {
        codecept: codeceptjs.codecept || codeceptjs.Codecept,
        Codecept: codeceptjs.codecept || codeceptjs.Codecept,
        container: codeceptjs.container,
        config: codeceptjs.config,
        event: codeceptjs.event,
        recorder: codeceptjs.recorder,
        output: codeceptjs.output,
        store: codeceptjs.store,
        Helper: codeceptjs.helper || codeceptjs.Helper,
        secret: codeceptjs.secret,
      };
    });
  }
  return _loaded;
}

/**
 * Import a CodeceptJS subpath module (e.g., 'codeceptjs/lib/mocha/test')
 * @param {string} subpath - e.g., 'codeceptjs/lib/mocha/test'
 * @returns {Promise<object>}
 */
async function importSubpath(subpath) {
  const mod = await import(subpath);
  return mod.default || mod;
}

module.exports = {
  codeceptjsModules,
  importSubpath,
};
