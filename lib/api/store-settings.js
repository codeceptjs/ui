const codeceptFactory = require('../model/codeceptjs-factory');
const settingsRepository = require('../model/settings-repository');

module.exports = (req, res) => {
    const settings = req.body;

    settingsRepository.storeSettings(settings);
    codeceptFactory.reloadConfig();

    res.json({
        message: 'Settings stored'
    });
  }
  