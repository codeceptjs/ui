import codeceptjs from 'codeceptjs';

const modules = {
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

/**
 * Returns CodeceptJS modules. Now synchronous since we're ESM.
 * Kept as async for backward compatibility with existing callers.
 * @returns {Promise<object>}
 */
export async function codeceptjsModules() {
  return modules;
}

/**
 * Import a CodeceptJS subpath module (e.g., 'codeceptjs/lib/mocha/test')
 * @param {string} subpath
 * @returns {Promise<object>}
 */
export async function importSubpath(subpath) {
  const mod = await import(subpath);
  return mod.default || mod;
}
