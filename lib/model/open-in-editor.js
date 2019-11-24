const debug = require('debug')('codepress:open-in-editor');
const { execSync } = require('child_process');
const { getSettings } = require('./settings-repository');

const openVSCode = fileName => {
    const { editor } = getSettings();
    try {
        execSync(`${editor} "${fileName}"`);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to open IDE. Update your settings.', err);
        debug(`Failed to open Editor - ${err}`);
    }
}

module.exports = fileName => {
    // TODO Make this configurable
    openVSCode(fileName);
}