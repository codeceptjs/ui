const codeceptjsFactory = require('../model/codeceptjs-factory');
const { storeSettings } = require('../model/settings-repository');
const setBrowser = require('../codeceptjs/configure/setBrowser');
const { setHeadlessWhen, setWindowSize, setHeadedWhen } = require('@codeceptjs/configure');

module.exports = async (req, res) => {
  const settings = req.body || {};
  const { isHeadless, windowSize, browser, editor, isSingleSession } = settings;

  await codeceptjsFactory.reloadConfig(async () => {
    setHeadlessWhen(isHeadless === true);
    setHeadedWhen(isHeadless === false);
    if (browser) await setBrowser(browser);
    if (windowSize && windowSize.width && windowSize.height) {
      setWindowSize(windowSize.width, windowSize.height);
    }
  });
  
  storeSettings({ editor, isSingleSession });

  res.json({
    message: 'Settings stored'
  });
};

