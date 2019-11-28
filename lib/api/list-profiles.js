const profileRepository = require('../model/profile-repository');

module.exports = (req, res) => {
  const profiles = profileRepository.getProfiles();
  if (!profiles) {
    res.status(404).json({ message: 'No profiles configured' });
  }
  res.json(profiles);
};
