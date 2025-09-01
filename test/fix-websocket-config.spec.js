const test = require('ava');
const { getPort } = require('../lib/config/env');

test('WebSocket port defaults correctly', (t) => {
  const wsPort = getPort('ws');
  t.true(typeof wsPort === 'string' || typeof wsPort === 'number');
  // Should default to 2999 unless overridden
  const expectedDefault = process.env.WS_PORT || process.env.wsPort || 2999;
  t.is(wsPort, expectedDefault);
});

test('Application port defaults correctly', (t) => {
  const appPort = getPort('application');
  t.true(typeof appPort === 'string' || typeof appPort === 'number');
  // Should default to 3333 unless overridden
  const expectedDefault = process.env.PORT || process.env.port || process.env.applicationPort || 3333;
  t.is(appPort, expectedDefault);
});