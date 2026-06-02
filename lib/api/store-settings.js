import codeceptjsFactory from '../model/codeceptjs-factory.js';
import { storeSettings } from '../model/settings-repository.js';
import setBrowser from '../codeceptjs/configure/setBrowser.js';
import configure from '@codeceptjs/configure';
const { setHeadlessWhen, setWindowSize, setHeadedWhen } = configure;

export default async (req, res) => {
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

