import test from 'ava';
import createSingleSessionHelper from '../lib/codeceptjs/single-session.helper.js';
import settingsRepository from '../lib/model/settings-repository.js';

// Mock Helper base class (simulates @codeceptjs/helper)
class MockHelper {
  constructor() {
    this.helpers = {};
    this.options = {};
  }
  _init() {}
  _before() {}
  _after() {}
  _passed() {}
  _failed() {}
}

const mockBrowserHelper = {
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
  const helper = createSingleSessionHelper(MockHelper);
  helper.helper = mockBrowserHelper;
  helper.enabled = true;
  
  // Mock settings to disable single session
  const originalGetSettings = settingsRepository.getSettings;
  settingsRepository.getSettings = () => ({ isSingleSession: false });
  
  helper.helper.isRunning = true;
  
  await helper._afterSuite();
  
  t.false(helper.helper.isRunning, 'Browser should be marked as not running');
  
  // Restore original function
  settingsRepository.getSettings = originalGetSettings;
});

test('SingleSessionHelper does not close browser when single session enabled', async (t) => {
  const helper = createSingleSessionHelper(MockHelper);
  helper.helper = mockBrowserHelper;
  helper.enabled = true;
  
  // Mock settings to enable single session
  const originalGetSettings = settingsRepository.getSettings;
  settingsRepository.getSettings = () => ({ isSingleSession: true });
  
  helper.helper.isRunning = true;
  
  await helper._afterSuite();
  
  t.false(helper.helper.isRunning, 'Browser should still be marked as not running for cleanup');
  
  // Restore original function
  settingsRepository.getSettings = originalGetSettings;
});

test('forceCleanup method exists and works', async (t) => {
  const helper = createSingleSessionHelper(MockHelper);
  helper.helper = mockBrowserHelper;
  
  t.is(typeof helper.forceCleanup, 'function', 'forceCleanup method should exist');
  
  await t.notThrowsAsync(helper.forceCleanup(), 'forceCleanup should not throw');
});

test('_closeBrowser handles different helper types gracefully', async (t) => {
  const helper = createSingleSessionHelper(MockHelper);
  
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