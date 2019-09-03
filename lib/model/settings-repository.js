const debug = require('debug')('codepress:settings-repository');
const fs = require('fs');
const path = require('path');

const CodepressDir = path.join(process.cwd(), '.codepress');
const SettingsConfFile = path.join(CodepressDir, 'settings.json');

const DefaultSettings = {
    headless: true
}

const getSettings = () => {
    if (!fs.existsSync(SettingsConfFile)) return DefaultSettings;

    const settingsAsStr = fs.readFileSync(SettingsConfFile);
    const settings = JSON.parse(settingsAsStr);
    
    debug('Loaded settings', settings);
    return settings;
}

const storeSettings = settings => {
    debug('Storing settings', settings);
    fs.writeFileSync(SettingsConfFile, JSON.stringify(settings));
}

module.exports = {
    getSettings,
    storeSettings
}