import test from 'ava';
import fs from 'fs';
import path from 'path';

// Import the module under test
import { getProfiles, getProfile } from './profile-repository.js';

test('getProfiles should return undefined when profile config file does not exist', (t) => {
  const originalExistsSync = fs.existsSync;
  fs.existsSync = () => false;
  
  try {
    const result = getProfiles();
    t.is(result, undefined);
  } finally {
    fs.existsSync = originalExistsSync;
  }
});

test('getProfile should handle undefined profiles gracefully', (t) => {
  const originalExistsSync = fs.existsSync;
  fs.existsSync = () => false;
  
  try {
    const result = getProfile('desktop');
    t.is(result, undefined);
  } finally {
    fs.existsSync = originalExistsSync;
  }
});