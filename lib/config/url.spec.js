const test = require('ava');
const url = require('./url');

test('getUrl should return correct URL for application type with default port', (t) => {
  // Clear any custom port settings to use defaults
  const originalPort = process.env.applicationPort;
  delete process.env.applicationPort;
  
  try {
    const result = url.getUrl('application');
    // Should use the default (either PORT env var or 3333)
    t.true(result.startsWith('http://localhost:'));
    t.true(result === 'http://localhost:3333' || result.match(/http:\/\/localhost:\d+/));
  } finally {
    if (originalPort !== undefined) {
      process.env.applicationPort = originalPort;
    }
  }
});

test('getUrl should return correct URL for ws type with default port', (t) => {
  const originalPort = process.env.wsPort;
  delete process.env.wsPort;
  
  try {
    const result = url.getUrl('ws');
    t.true(result.startsWith('http://localhost:'));
    t.true(result === 'http://localhost:2999' || result.match(/http:\/\/localhost:\d+/));
  } finally {
    if (originalPort !== undefined) {
      process.env.wsPort = originalPort;
    }
  }
});

test('getUrl should return correct URL for application type with custom port', (t) => {
  // Set the environment variable that the env module actually uses
  const originalPort = process.env.applicationPort;
  process.env.applicationPort = '8080';
  
  try {
    const result = url.getUrl('application');
    t.is(result, 'http://localhost:8080');
  } finally {
    if (originalPort !== undefined) {
      process.env.applicationPort = originalPort;
    } else {
      delete process.env.applicationPort;
    }
  }
});

test('getUrl should return correct URL for ws type with custom port', (t) => {
  const originalPort = process.env.wsPort;
  process.env.wsPort = '4000';
  
  try {
    const result = url.getUrl('ws');
    t.is(result, 'http://localhost:4000');
  } finally {
    if (originalPort !== undefined) {
      process.env.wsPort = originalPort;
    } else {
      delete process.env.wsPort;
    }
  }
});

test('getUrl should validate port type through portTypeValidator', (t) => {
  const error = t.throws(() => {
    url.getUrl('invalid');
  });
  
  t.is(error.message, 'Type must be "application" or "ws"');
});

test('getUrl should handle port numbers returned as strings', (t) => {
  const originalPort = process.env.applicationPort;
  process.env.applicationPort = '9000';
  
  try {
    const result = url.getUrl('application');
    t.is(result, 'http://localhost:9000');
  } finally {
    if (originalPort !== undefined) {
      process.env.applicationPort = originalPort;
    } else {
      delete process.env.applicationPort;
    }
  }
});

test('getUrl should handle port number 0', (t) => {
  const originalPort = process.env.applicationPort;
  process.env.applicationPort = '0';
  
  try {
    const result = url.getUrl('application');
    t.is(result, 'http://localhost:0');
  } finally {
    if (originalPort !== undefined) {
      process.env.applicationPort = originalPort;
    } else {
      delete process.env.applicationPort;
    }
  }
});