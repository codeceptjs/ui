const test = require('ava');
const listProfiles = require('./list-profiles');

// Mock the profile repository
const profileRepository = require('../model/profile-repository');

test.beforeEach((t) => {
  // Create mock request and response objects
  t.context.req = {};
  t.context.res = {
    json: (data) => { t.context.responseData = data; },
    status: (code) => { 
      t.context.statusCode = code; 
      return { json: (data) => { t.context.responseData = data; } };
    }
  };
  
  // Store original getProfiles function
  t.context.originalGetProfiles = profileRepository.getProfiles;
});

test.afterEach((t) => {
  // Restore original function
  profileRepository.getProfiles = t.context.originalGetProfiles;
});

test('should return profiles when profiles exist', (t) => {
  const mockProfiles = {
    default: 'desktop',
    desktop: { browsers: ['chrome'] },
    mobile: { browsers: ['chrome:emulation:iPhone'] }
  };
  
  // Mock getProfiles to return test data
  profileRepository.getProfiles = () => mockProfiles;
  
  listProfiles(t.context.req, t.context.res);
  
  t.deepEqual(t.context.responseData, mockProfiles);
  t.is(t.context.statusCode, undefined); // 200 is default
});

test('should return 404 when no profiles exist', (t) => {
  // Mock getProfiles to return undefined
  profileRepository.getProfiles = () => undefined;
  
  listProfiles(t.context.req, t.context.res);
  
  t.is(t.context.statusCode, 404);
  t.deepEqual(t.context.responseData, { message: 'No profiles configured' });
});

test('should return 404 when getProfiles returns null', (t) => {
  // Mock getProfiles to return null
  profileRepository.getProfiles = () => null;
  
  listProfiles(t.context.req, t.context.res);
  
  t.is(t.context.statusCode, 404);
  t.deepEqual(t.context.responseData, { message: 'No profiles configured' });
});

test('should return empty object when profiles is empty', (t) => {
  const mockProfiles = {};
  
  // Mock getProfiles to return empty object
  profileRepository.getProfiles = () => mockProfiles;
  
  listProfiles(t.context.req, t.context.res);
  
  t.deepEqual(t.context.responseData, mockProfiles);
  t.is(t.context.statusCode, undefined);
});