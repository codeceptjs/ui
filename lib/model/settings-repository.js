const debug = require('debug')('codepress:settings-repository');

const settings = {
  editor: 'code --goto',
};

const getSettings = () => {
  debug('get settings', settings);
  return settings;
}

const storeSettings = newSettings => {
  debug('set settings', settings);
  Object.assign(settings, newSettings);
}

module.exports = {
  getSettings,
  storeSettings
}
