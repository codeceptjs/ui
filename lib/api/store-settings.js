const codeceptjsFactory = require('../model/codeceptjs-factory');
const { storeSettings } = require('../model/settings-repository');
const setBrowser = require('../codeceptjs/configure/setBrowser');
const { setHeadlessWhen, setWindowSize, setHeadedWhen } = require('@codeceptjs/configure');

module.exports = (req, res) => {
  const settings = req.body || {};
  const { isHeadless, windowSize, browser, editor } = settings;

  codeceptjsFactory.reloadConfig(() => {
    setHeadlessWhen(isHeadless === true);
    setHeadedWhen(isHeadless === false);
    if (browser) setBrowser(browser);
    if (windowSize && windowSize.width && windowSize.height) {
      setWindowSize(windowSize.width, windowSize.height);
    }
  });
  
  storeSettings({ editor });

  res.json({
    message: 'Settings stored'
  });
}

