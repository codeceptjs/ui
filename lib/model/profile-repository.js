const debug = require('debug')('codeceptjs:profile-repository');
const fs = require('fs');
const path = require('path');

const CodeceptJSDir = path.join(process.cwd(), '.codeceptjs');
const ProfileConfigFile = path.join(CodeceptJSDir, 'profile.conf.js');

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