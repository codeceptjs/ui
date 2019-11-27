const settingsRepository = require('../model/settings-repository');

module.exports = (req, res) => {
  const settings = settingsRepository.getSettings();
  
  res.json(settings);
};
