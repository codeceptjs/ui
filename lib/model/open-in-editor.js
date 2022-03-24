const debug = require('debug')('codeceptjs:open-in-editor');
const { execSync } = require('child_process');
const { getSettings } = require('./settings-repository');

const openVSCode = fileName => {
  const { editor } = getSettings();
  return execSync(`${editor} "${fileName}"`, (err) => {
    if (!err) return 'Ok';
        console.error('Failed to open editor: ', err.toString()); // eslint-disable-line
        console.error(`Please, update your settings. Current editor command: ${editor}`); // eslint-disable-line
    debug(`Failed to open Editor - ${err}`);
    return `${err}`;
  });
};

module.exports = fileName => {
  // TODO Make this configurable
  openVSCode(fileName);
};
