const debug = require('debug')('codeceptjs:settings-repository');

const settings = {};

const getSettings = () => {
  debug('get settings', settings);
  return settings;
};

const storeSettings = newSettings => {
  debug('set settings', settings);
  Object.assign(settings, newSettings);
};

module.exports = {
  getSettings,
  storeSettings
};
