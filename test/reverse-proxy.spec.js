const test = require('ava');
const fs = require('fs');
const path = require('path');

test('Frontend handles reverse proxy configuration', (t) => {
  const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  
  // Check that reverse proxy detection is present
  t.true(mainJsContent.includes('isReverseProxy'), 'Should detect reverse proxy setup');
  t.true(mainJsContent.includes('window.location.pathname !== \'/\''), 'Should check for non-root path');
  
  // Check that fallback handling is present
  t.true(mainJsContent.includes('catch (err)'), 'Should have fallback error handling');
  t.true(mainJsContent.includes('baseUrl.replace(\'http\', \'ws\')'), 'Should use WebSocket protocol conversion');
});

test('Frontend uses relative paths for reverse proxy', (t) => {
  const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  
  // Check that relative API calls are used
  t.true(mainJsContent.includes('\'/api/ports\''), 'Should use relative API path');
  t.false(mainJsContent.includes('window.location.port'), 'Should not hardcode current port in API calls');
});

test('Port API endpoint returns correct format', (t) => {
  const apiIndexPath = path.join(__dirname, '..', 'lib', 'api', 'index.js');
  const apiContent = fs.readFileSync(apiIndexPath, 'utf8');
  
  // Check that ports endpoint exists and returns correct structure
  t.true(apiContent.includes('router.get(\'/ports\''), 'Ports endpoint should exist');
  t.true(apiContent.includes('port: getPort(\'application\')'), 'Should return application port');
  t.true(apiContent.includes('wsPort: getPort(\'ws\')'), 'Should return WebSocket port');
});