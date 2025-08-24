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
    
    // Proper cleanup when single session is disabled
    const { isSingleSession } = getSettings();
    if (!isSingleSession && this.helper.isRunning) {
      // Close browser when single session is disabled
      this._closeBrowser();
    } else {
      // Don't close browser in single session mode, but mark as not running
      this.helper.isRunning = false;
    }
  }

  async _closeBrowser() {
    if (!this.helper) return;
    
    try {
      // Gracefully close the browser
      if (this.helper._stopBrowser) {
        await this.helper._stopBrowser();
      } else if (this.helper.browser && this.helper.browser.close) {
        await this.helper.browser.close();
      } else if (this.helper.page && this.helper.page.close) {
        await this.helper.page.close();
      }
      this.helper.isRunning = false;
    } catch (err) {
      // Force cleanup on error
      this.helper.isRunning = false;
    }
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

  // Method to force cleanup all browser instances
  async forceCleanup() {
    await this._closeBrowser();
  }

}

module.exports = SingleSessionHelper;
