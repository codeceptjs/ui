const debug = require('debug')('codepress:profile-repository');
const fs = require('fs');
const path = require('path');

const CodepressDir = path.join(process.cwd(), '.codepress');
const ProfileConfigFile = path.join(CodepressDir, 'profile.conf.js');

const getProfiles = () => {
  if (!fs.existsSync(ProfileConfigFile)) return;

  const profileConfig = require(ProfileConfigFile);
   
  // TODO Do a schema check
  debug('Read profile config', profileConfig);

  return profileConfig;
};

const getProfile = profileName => {
  const profiles = getProfiles();
  return profiles[profileName] || profiles[profiles.default];
};

module.exports = {
  getProfiles,
  getProfile
};