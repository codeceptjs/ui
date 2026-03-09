import profileRepository from '../model/profile-repository.js';

export default (req, res) => {
  const profiles = profileRepository.getProfiles();
  if (!profiles) {
    return res.status(404).json({ message: 'No profiles configured' });
  }
  res.json(profiles);
};
