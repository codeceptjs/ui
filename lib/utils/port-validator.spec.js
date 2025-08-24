const test = require('ava');
const portValidator = require('./port-validator');

test('should return parsed integer for valid port string', (t) => {
  const result = portValidator('8080');
  t.is(result, 8080);
});

test('should return parsed integer for valid port number', (t) => {
  const result = portValidator(3000);
  t.is(result, 3000);
});

test('should return parsed integer for port with leading zeros', (t) => {
  const result = portValidator('0080');
  t.is(result, 80);
});

test('should return 0 for port "0"', (t) => {
  const result = portValidator('0');
  t.is(result, 0);
});

test('should return NaN for invalid port string', (t) => {
  const result = portValidator('invalid');
  t.true(Number.isNaN(result));
});

test('should return empty string for empty string input', (t) => {
  const result = portValidator('');
  t.is(result, '');
});

test('should return null for null input', (t) => {
  const result = portValidator(null);
  t.is(result, null);
});

test('should return undefined for undefined input', (t) => {
  const result = portValidator(undefined);
  t.is(result, undefined);
});

test('should handle floating point numbers by truncating', (t) => {
  const result = portValidator('8080.5');
  t.is(result, 8080);
});

test('should handle negative numbers', (t) => {
  const result = portValidator('-1234');
  t.is(result, -1234);
});