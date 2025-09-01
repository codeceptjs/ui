const test = require('ava');
const fs = require('fs');
const path = require('path');

test('Server startup script has proper error handling', (t) => {
  const startupScript = path.join(__dirname, '..', 'bin', 'codecept-ui.js');
  const content = fs.readFileSync(startupScript, 'utf8');
  
  // Check for error handling patterns
  t.true(content.includes('httpServer.on(\'error\''), 'Should have HTTP server error handling');
  t.true(content.includes('wsServer.on(\'error\''), 'Should have WebSocket server error handling');
  t.true(content.includes('EADDRINUSE'), 'Should handle port already in use error');
  t.true(content.includes('gracefulShutdown'), 'Should have graceful shutdown handling');
  t.true(content.includes('SIGINT'), 'Should handle SIGINT signal');
  t.true(content.includes('SIGTERM'), 'Should handle SIGTERM signal');
});

test('Frontend has retry logic for port fetching', (t) => {
  const mainScript = path.join(__dirname, '..', 'src', 'main.js');
  const content = fs.readFileSync(mainScript, 'utf8');
  
  // Check for retry logic patterns
  t.true(content.includes('maxRetries'), 'Should have maximum retry limit');
  t.true(content.includes('retryCount'), 'Should track retry attempts');
  t.true(content.includes('Successfully fetched WebSocket port info'), 'Should log successful port fetch');
  t.true(content.includes('Failed to fetch port info'), 'Should log failed port fetch attempts');
  t.true(content.includes('setTimeout'), 'Should have delay between retries');
});

test('Socket.IO configuration includes reliability improvements', (t) => {
  const startupScript = path.join(__dirname, '..', 'bin', 'codecept-ui.js');
  const content = fs.readFileSync(startupScript, 'utf8');
  
  // Check for Socket.IO reliability configurations
  t.true(content.includes('pingTimeout'), 'Should configure ping timeout');
  t.true(content.includes('pingInterval'), 'Should configure ping interval');
  t.true(content.includes('connectTimeout'), 'Should configure connection timeout');
  t.true(content.includes('allowRequest'), 'Should have custom connection validation');
});

test('Frontend Socket.IO has connection options for reliability', (t) => {
  const mainScript = path.join(__dirname, '..', 'src', 'main.js');
  const content = fs.readFileSync(mainScript, 'utf8');
  
  // Check for Socket.IO client options
  t.true(content.includes('options:'), 'Should have Socket.IO client options');
  t.true(content.includes('reconnection: true'), 'Should enable reconnection');
  t.true(content.includes('reconnectionAttempts'), 'Should configure reconnection attempts');
  t.true(content.includes('reconnectionDelay'), 'Should configure reconnection delay');
});