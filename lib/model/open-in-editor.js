const { exec } = require('child_process');

module.exports = fileName => {
    // TODO Make this configurable
    exec(`code --goto "${fileName}"`)
}