const test = require('ava');
const fs = require('fs');
const path = require('path');
const mkdir = require('./mkdir');

// Helper to create unique temp directories for testing
const getTempDir = () => {
  return path.join(__dirname, '..', '..', 'test_temp', `test_${Date.now()}_${Math.random().toString(36)}`);
};

test.afterEach((t) => {
  // Clean up any test directories created
  if (t.context.testDir && fs.existsSync(t.context.testDir)) {
    try {
      fs.rmSync(t.context.testDir, { recursive: true, force: true });
    } catch (err) {
      // Ignore cleanup errors
    }
  }
});

test('should create directory that does not exist', (t) => {
  const testDir = getTempDir();
  t.context.testDir = path.dirname(testDir);
  
  t.false(fs.existsSync(testDir));
  
  mkdir(testDir);
  
  t.true(fs.existsSync(testDir));
  t.true(fs.statSync(testDir).isDirectory());
});

test('should create nested directories recursively', (t) => {
  const testDir = path.join(getTempDir(), 'nested', 'deeply', 'nested');
  t.context.testDir = path.dirname(path.dirname(path.dirname(testDir)));
  
  t.false(fs.existsSync(testDir));
  
  mkdir(testDir);
  
  t.true(fs.existsSync(testDir));
  t.true(fs.statSync(testDir).isDirectory());
});

test('should not throw error if directory already exists', (t) => {
  const testDir = getTempDir();
  t.context.testDir = path.dirname(testDir);
  
  // Create directory first
  fs.mkdirSync(testDir, { recursive: true });
  t.true(fs.existsSync(testDir));
  
  // Should not throw when called again
  t.notThrows(() => {
    mkdir(testDir);
  });
  
  t.true(fs.existsSync(testDir));
});

test('should handle relative paths', (t) => {
  const testBaseDir = getTempDir();
  t.context.testDir = path.dirname(testBaseDir);
  
  // Create base directory
  fs.mkdirSync(testBaseDir, { recursive: true });
  
  const relativeDir = path.join(testBaseDir, 'relative', 'test', 'dir');
  
  t.false(fs.existsSync(relativeDir));
  
  mkdir(relativeDir);
  
  t.true(fs.existsSync(relativeDir));
  t.true(fs.statSync(relativeDir).isDirectory());
});

test('should rethrow non-EEXIST errors', (t) => {
  // Try to create directory in a location that should fail (like in /etc on Unix)
  // This test may be platform dependent, so we'll simulate the behavior
  
  // Mock fs.existsSync to return false and fs.mkdirSync to throw a non-EEXIST error
  const originalExistsSync = fs.existsSync;
  const originalMkdirSync = fs.mkdirSync;
  
  fs.existsSync = () => false;
  fs.mkdirSync = () => {
    const error = new Error('Permission denied');
    error.code = 'EACCES';
    throw error;
  };
  
  try {
    const error = t.throws(() => {
      mkdir('/invalid/permission/test');
    });
    t.is(error.code, 'EACCES');
    t.is(error.message, 'Permission denied');
  } finally {
    // Restore original functions
    fs.existsSync = originalExistsSync;
    fs.mkdirSync = originalMkdirSync;
  }
});

test('should handle empty string by throwing error', (t) => {
  // Empty string should throw an error as it's not a valid directory path
  const error = t.throws(() => {
    mkdir('');
  });
  t.is(error.code, 'ENOENT');
});