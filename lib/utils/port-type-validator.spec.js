const test = require('ava');
const portTypeValidator = require('./port-type-validator');

test('should not throw error for valid "application" type', (t) => {
  t.notThrows(() => {
    portTypeValidator('application');
  });
});

test('should not throw error for valid "ws" type', (t) => {
  t.notThrows(() => {
    portTypeValidator('ws');
  });
});

test('should throw error for invalid type', (t) => {
  const error = t.throws(() => {
    portTypeValidator('invalid');
  });
  t.is(error.message, 'Type must be "application" or "ws"');
});

test('should throw error for empty string', (t) => {
  const error = t.throws(() => {
    portTypeValidator('');
  });
  t.is(error.message, 'Type must be "application" or "ws"');
});

test('should throw error for null', (t) => {
  const error = t.throws(() => {
    portTypeValidator(null);
  });
  t.is(error.message, 'Type must be "application" or "ws"');
});

test('should throw error for undefined', (t) => {
  const error = t.throws(() => {
    portTypeValidator(undefined);
  });
  t.is(error.message, 'Type must be "application" or "ws"');
});

test('should throw error for number input', (t) => {
  const error = t.throws(() => {
    portTypeValidator(123);
  });
  t.is(error.message, 'Type must be "application" or "ws"');
});

test('should throw error for case-sensitive mismatch', (t) => {
  const error = t.throws(() => {
    portTypeValidator('Application');
  });
  t.is(error.message, 'Type must be "application" or "ws"');
});

test('should throw error for whitespace variations', (t) => {
  const error = t.throws(() => {
    portTypeValidator(' application ');
  });
  t.is(error.message, 'Type must be "application" or "ws"');
});