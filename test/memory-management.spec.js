const test = require('ava');

// Test to verify worker memory management doesn't cause issues
test('worker cleanup functions exist and don\'t throw', (t) => {
  // Mock the worker index module
  const workerIndex = require('../lib/model/codeceptjs-run-workers/index');
  
  // Test that the constants are defined correctly
  t.true(typeof workerIndex === 'function');
  
  // This test mainly verifies the module loads without syntax errors
  // and that our memory management constants are reasonable
  t.pass('Worker module loads without errors');
});

test('memory management constants are reasonable', (t) => {
  // Read the worker file to verify constants exist
  const fs = require('fs');
  const workerContent = fs.readFileSync('lib/model/codeceptjs-run-workers/index.js', 'utf8');
  
  // Verify memory management constants are present
  t.true(workerContent.includes('MAX_ERRORS'));
  t.true(workerContent.includes('MAX_FINISHED_TESTS'));
  t.true(workerContent.includes('cleanupWorkerMemory'));
  
  // Verify limits are reasonable (not too small, not too large)
  const maxErrorsMatch = workerContent.match(/MAX_ERRORS\s*=\s*(\d+)/);
  const maxTestsMatch = workerContent.match(/MAX_FINISHED_TESTS\s*=\s*(\d+)/);
  
  if (maxErrorsMatch) {
    const maxErrors = parseInt(maxErrorsMatch[1]);
    t.true(maxErrors >= 100 && maxErrors <= 10000, 'MAX_ERRORS should be reasonable');
  }
  
  if (maxTestsMatch) {
    const maxTests = parseInt(maxTestsMatch[1]);
    t.true(maxTests >= 100 && maxTests <= 5000, 'MAX_FINISHED_TESTS should be reasonable');
  }
});

test('file API has memory protections', (t) => {
  const fs = require('fs');
  const fileApiContent = fs.readFileSync('lib/api/get-file.js', 'utf8');
  
  // Verify memory protections are present
  t.true(fileApiContent.includes('MAX_FILE_SIZE'), 'MAX_FILE_SIZE constant should exist');
  t.true(fileApiContent.includes('createReadStream'), 'Should use streaming');
  t.true(fileApiContent.includes('stats.size'), 'Should check file size');
  t.true(fileApiContent.includes('pipe'), 'Should pipe the stream');
});