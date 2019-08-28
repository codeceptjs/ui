const debug = require('debug')('codepress:open-in-editor');
const { execSync } = require('child_process');

const openVSCode = fileName => {
    try {
        execSync(`code --goto "${fileName}"`);
    } catch (err) {
        // eslint-disable-next-line no-console
        debug(`Failed to open VSCode - ${err}`);
    }
}

module.exports = fileName => {
    // TODO Make this configurable
    openVSCode(fileName);
}