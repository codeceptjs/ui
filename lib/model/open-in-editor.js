const debug = require('debug')('codepress:open-in-editor');
const { exec } = require('child_process');
const { getSettings } = require('./settings-repository');

const openVSCode = fileName => {
    const { editor } = getSettings();
    exec(`${editor} "${fileName}"`, (err) => {
        if (!err) return;
        console.error('Failed to open editor: ', err.toString()); // eslint-disable-line
        console.error(`Please, update your settings. Current editor command: ${editor}`); // eslint-disable-line
        debug(`Failed to open Editor - ${err}`);
    });
};

module.exports = fileName => {
    // TODO Make this configurable
    openVSCode(fileName);
};
