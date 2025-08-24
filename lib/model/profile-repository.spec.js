const test = require('ava');
const fs = require('fs');
const path = require('path');

// Since the profile repository is hard to mock due to require() calls,
// let's focus on testing the path construction and basic behavior

test('should construct correct file path for profile config', (t) => {
  const originalCwd = process.cwd;
  process.cwd = () => '/test/project';
  
  try {
    // Import after mocking process.cwd
    delete require.cache[require.resolve('./profile-repository')];
    const profileRepository = require('./profile-repository');
    
    const originalExistsSync = fs.existsSync;
    let checkedPath = '';
    
    fs.existsSync = (filePath) => {
      checkedPath = filePath;
      return false;
    };
    
    try {
      profileRepository.getProfiles();
      const expectedPath = path.join('/test/project', '.codeceptjs', 'profile.conf.js');
      t.is(checkedPath, expectedPath);
    } finally {
      fs.existsSync = originalExistsSync;
    }
  } finally {
    process.cwd = originalCwd;
  }
});

test('getProfiles should return undefined when profile config file does not exist', (t) => {
  const originalExistsSync = fs.existsSync;
  fs.existsSync = () => false;
  
  try {
    // Clear cache and re-require to get fresh module
    delete require.cache[require.resolve('./profile-repository')];
    const profileRepository = require('./profile-repository');
    
    const result = profileRepository.getProfiles();
    t.is(result, undefined);
  } finally {
    fs.existsSync = originalExistsSync;
  }
});

test('getProfile should handle undefined profiles gracefully', (t) => {
  const originalExistsSync = fs.existsSync;
  fs.existsSync = () => false;
  
  try {
    delete require.cache[require.resolve('./profile-repository')];
    const profileRepository = require('./profile-repository');
    
    const result = profileRepository.getProfile('desktop');
    t.is(result, undefined);
  } finally {
    fs.existsSync = originalExistsSync;
  }
});