// Test file to reproduce the nanoid ES Module issue

const path = require('path');

// Set up necessary environment for the module to work
process.env.CODECEPT_ROOT_DIR = '/home/runner/work/ui/ui';

console.log('Testing nanoid require...');

try {
  const { nanoid } = require('nanoid');
  console.log('SUCCESS: nanoid imported successfully');
  console.log('Generated ID:', nanoid());
} catch (error) {
  console.error('ERROR requiring nanoid:', error.message);
}

console.log('\nTesting the actual file...');

try {
  require('/home/runner/work/ui/ui/lib/codeceptjs/realtime-reporter.helper.js');
  console.log('SUCCESS: realtime-reporter.helper.js loaded');
} catch (error) {
  console.error('ERROR loading realtime-reporter.helper.js:', error.message);
}