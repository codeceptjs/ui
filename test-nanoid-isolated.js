// Test file to isolate the nanoid ES Module issue

console.log('Testing nanoid import in ES Module environment...');

// First, let's check what we have
console.log('Node version:', process.version);

try {
  // Direct require like in the original file
  const { nanoid } = require('nanoid');
  console.log('SUCCESS: nanoid imported successfully via require');
  console.log('Generated ID:', nanoid());
} catch (error) {
  console.error('ERROR requiring nanoid:', error.message);
  
  // Test dynamic import as the fix
  console.log('\nTesting dynamic import...');
  (async () => {
    try {
      const { nanoid } = await import('nanoid');
      console.log('SUCCESS: nanoid imported successfully via dynamic import');
      console.log('Generated ID:', nanoid());
    } catch (err) {
      console.error('ERROR with dynamic import:', err.message);
    }
  })();
}