const { config } = require('codeceptjs');

module.exports = function(browser) {

  config.addHook((cfg) => {
    if (cfg.helpers.Puppeteer) {
      cfg.helpers.Puppeteer.browser = browser;
    }
    if (cfg.helpers.Protractor) {
      cfg.helpers.Protractor.browser = browser;
    }
    if (cfg.helpers.WebDriver) {
      cfg.helpers.WebDriver.browser = browser;
    }
    if (cfg.helpers.TestCafe) {
      cfg.helpers.TestCafe.browser = browser;
    }
    if (cfg.helpers.Appium) {
      cfg.helpers.Appium.browser = browser;
    }
  });
};