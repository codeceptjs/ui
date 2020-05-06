// eslint-disable-next-line no-undef
let Helper = codecept_helper;

const { getSettings } = require('../model/settings-repository');
const { container } = require('codeceptjs');

const supportedHelpers = [
  'TestCafe',
  'Protractor',
  'Puppeteer',
  'Nightmare',
  'WebDriver',
  'Playwright'
];

class SingleSessionHelper extends Helper {
  constructor(options) {
    super(options);
    this.helper = null;
    this.enabled = global.isElectron || false;
  }

  _init() {
    const helpers = container.helpers();
    for (const supportedHelper of supportedHelpers) {
      const helper = helpers[supportedHelper];
      if (!helper) continue;
      this.helper = helper;
      break;
    }
  }

  async _beforeSuite() {
    const { isSingleSession } = getSettings();
    if (isSingleSession) this.enabled = true;
    if (!this.enabled || !this.helper) return;
    this.helper.options.manualStart = true;
    this.helper.options.restart = false;

    await this._startBrowserIfNotRunning();
  }

  _afterSuite() {
    if (!this.enabled || !this.helper) return;
    // dont close browser in the end
    this.helper.isRunning = false;
  }

  async _startBrowserIfNotRunning() {
    if (!this.helper) return;
    
    try {
      await this.helper.grabCurrentUrl();
    } catch (err) {
      await this.helper._startBrowser();
    }
    this.helper.isRunning = true;
  }  

}

module.exports = SingleSessionHelper;
