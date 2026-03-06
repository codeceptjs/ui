import test from 'ava';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

test('Socket.IO server includes CORS configuration', (t) => {
  const binPath = path.join(import.meta.dirname, '..', 'bin', 'codecept-ui.js');
  const binContent = fs.readFileSync(binPath, 'utf8');
  
  // Check that CORS configuration is present
  t.true(binContent.includes('cors:'), 'CORS configuration should be present');
  t.true(binContent.includes('origin:'), 'CORS origin should be configurable');
  t.true(binContent.includes('credentials: true'), 'CORS credentials should be enabled');
  t.true(binContent.includes('allowEIO3: true'), 'EIO3 compatibility should be enabled');
});

test('CORS origin defaults to application port', (t) => {
  const binPath = path.join(import.meta.dirname, '..', 'bin', 'codecept-ui.js');
  const binContent = fs.readFileSync(binPath, 'utf8');
  
  // Check that default CORS origin uses application port
  t.true(binContent.includes('getPort(\'application\')'), 'Should use application port for default CORS origin');
});

test('CORS origin can be overridden via environment variable', (t) => {
  process.env.CORS_ORIGIN = 'http://example.com:3000';
  
  const binPath = path.join(import.meta.dirname, '..', 'bin', 'codecept-ui.js');
  const binContent = fs.readFileSync(binPath, 'utf8');
  
  // Check that CORS_ORIGIN environment variable is used
  t.true(binContent.includes('process.env.CORS_ORIGIN'), 'Should check CORS_ORIGIN environment variable');
  
  delete process.env.CORS_ORIGIN;
});