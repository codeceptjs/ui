import * as settingsRepository from '../model/settings-repository.js';

export default (req, res) => {
  const settings = settingsRepository.getSettings();
  
  res.json(settings);
};
