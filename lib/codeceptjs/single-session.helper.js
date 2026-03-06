const { getSettings } = require('../model/settings-repository');
const { codeceptjsModules } = require('./codeceptjs-imports');

const supportedHelpers = [
  'TestCafe',
  'Protractor',
  'Puppeteer',
  'Nightmare',
  'WebDriver',
  'Playwright'
];

/**
 * Factory that creates SingleSessionHelper class.
 * @param {Function} HelperBase - The CodeceptJS Helper base class
 * @returns {SingleSessionHelper} instance
 */
module.exports = function createSingleSessionHelper(HelperBase) {
  // container will be loaded lazily from codeceptjs modules
  let container;
  codeceptjsModules().then(mods => {
    container = mods.container;
  });

  class SingleSessionHelper extends HelperBase {
    constructor(options) {
      super(options);
      this.helper = null;
      this.enabled = global.isElectron || false;
    }

    _init() {
      if (!container) return;
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
      
      const { isSingleSession } = getSettings();
      if (!isSingleSession && this.helper.isRunning) {
        this._closeBrowser();
      } else {
        this.helper.isRunning = false;
      }
    }

    async _closeBrowser() {
      if (!this.helper) return;
      
      try {
        if (this.helper._stopBrowser) {
          await this.helper._stopBrowser();
        } else if (this.helper.browser && this.helper.browser.close) {
          await this.helper.browser.close();
        } else if (this.helper.page && this.helper.page.close) {
          await this.helper.page.close();
        }
        this.helper.isRunning = false;
      } catch (err) {
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

    async forceCleanup() {
      await this._closeBrowser();
    }
  }

  return new SingleSessionHelper();
};
