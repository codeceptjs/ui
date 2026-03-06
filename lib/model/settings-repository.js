import Debug from 'debug';
const debug = Debug('codeceptjs:settings-repository');

const settings = {};

// Allowlist of valid settings keys
const ALLOWED_KEYS = new Set([
  'isSingleSession',
  'isHeadless',
  'browser',
  'windowSize',
  'url',
  'basicAuth',
  'capabilities'
]);

const getSettings = () => {
  debug('get settings', settings);
  return settings;
};

const storeSettings = newSettings => {
  debug('set settings', newSettings);
  // Only allow known settings keys
  for (const key of Object.keys(newSettings)) {
    if (ALLOWED_KEYS.has(key)) {
      settings[key] = newSettings[key];
    } else {
      debug('Ignoring unknown setting key:', key);
    }
  }
};

export { getSettings, storeSettings };
