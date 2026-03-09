import Debug from 'debug';
const debug = Debug('codeceptjs:profile-repository');
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
  if (!profiles) return;
  return profiles[profileName] || profiles[profiles.default];
};

export { getProfiles, getProfile };

const profileRepository = { getProfiles, getProfile };
export default profileRepository;