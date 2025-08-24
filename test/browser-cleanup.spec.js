const test = require('ava');
const SingleSessionHelper = require('../lib/codeceptjs/single-session.helper');

// Mock the settings repository
const mockSettings = {
  isSingleSession: true
};

const mockHelper = {
  isRunning: false,
  _stopBrowser: async () => {},
  browser: {
    close: async () => {}
  },
  page: {
    close: async () => {}
  },
  grabCurrentUrl: async () => 'http://localhost',
  _startBrowser: async () => {}
};

test('SingleSessionHelper properly closes browser when single session disabled', async (t) => {
  const helper = new SingleSessionHelper();
  helper.helper = mockHelper;
  helper.enabled = true;
  
  // Mock settings to disable single session
  const originalGetSettings = require('../lib/model/settings-repository').getSettings;
  require('../lib/model/settings-repository').getSettings = () => ({ isSingleSession: false });
  
  helper.helper.isRunning = true;
  
  await helper._afterSuite();
  
  t.false(helper.helper.isRunning, 'Browser should be marked as not running');
  
  // Restore original function
  require('../lib/model/settings-repository').getSettings = originalGetSettings;
});

test('SingleSessionHelper does not close browser when single session enabled', async (t) => {
  const helper = new SingleSessionHelper();
  helper.helper = mockHelper;
  helper.enabled = true;
  
  // Mock settings to enable single session
  const originalGetSettings = require('../lib/model/settings-repository').getSettings;
  require('../lib/model/settings-repository').getSettings = () => ({ isSingleSession: true });
  
  helper.helper.isRunning = true;
  
  await helper._afterSuite();
  
  t.false(helper.helper.isRunning, 'Browser should still be marked as not running for cleanup');
  
  // Restore original function
  require('../lib/model/settings-repository').getSettings = originalGetSettings;
});

test('forceCleanup method exists and works', async (t) => {
  const helper = new SingleSessionHelper();
  helper.helper = mockHelper;
  
  t.is(typeof helper.forceCleanup, 'function', 'forceCleanup method should exist');
  
  await t.notThrowsAsync(helper.forceCleanup(), 'forceCleanup should not throw');
});

test('_closeBrowser handles different helper types gracefully', async (t) => {
  const helper = new SingleSessionHelper();
  
  // Test with _stopBrowser method
  helper.helper = { 
    _stopBrowser: async () => {},
    isRunning: true
  };
  await t.notThrowsAsync(helper._closeBrowser());
  
  // Test with browser.close method
  helper.helper = { 
    browser: { close: async () => {} },
    isRunning: true
  };
  await t.notThrowsAsync(helper._closeBrowser());
  
  // Test with page.close method
  helper.helper = { 
    page: { close: async () => {} },
    isRunning: true
  };
  await t.notThrowsAsync(helper._closeBrowser());
  
  // Test with no helper
  helper.helper = null;
  await t.notThrowsAsync(helper._closeBrowser());
});