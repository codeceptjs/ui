const test = require('ava');
const safeSerialize = require('../lib/utils/safe-serialize');

test('safeSerialize handles circular references', (t) => {
  const obj = { name: 'test', id: 123 };
  obj.self = obj;
  
  const result = safeSerialize(obj);
  
  t.is(result.name, 'test');
  t.is(result.id, 123);
  t.is(result.self, '[Circular Reference]');
});

test('safeSerialize handles Error objects with circular references', (t) => {
  const error = new Error('Test error');
  error.code = 'TEST_CODE';
  error.cause = error; // Create circular reference
  
  const result = safeSerialize(error);
  
  t.is(result.name, 'Error');
  t.is(result.message, 'Test error');
  t.is(result.code, 'TEST_CODE');
  t.is(result.type, 'Error');
  t.truthy(result.stack);
});

test('safeSerialize limits recursion depth', (t) => {
  const deep = { level: 1 };
  let current = deep;
  for (let i = 2; i <= 60; i++) {
    current.next = { level: i };
    current = current.next;
  }
  
  const result = safeSerialize(deep);
  const serialized = JSON.stringify(result);
  
  t.true(serialized.includes('[Object: max depth reached]'));
});

test('safeSerialize preserves normal objects', (t) => {
  const obj = {
    name: 'test',
    count: 42,
    tags: ['a', 'b'],
    nested: {
      value: 'nested'
    }
  };
  
  const result = safeSerialize(obj);
  
  t.deepEqual(result, obj);
});

test('safeSerialize handles arrays', (t) => {
  const arr = [1, 2, { name: 'test' }];
  const result = safeSerialize(arr);
  
  t.deepEqual(result, arr);
});

test('safeSerialize handles Date objects', (t) => {
  const date = new Date('2023-01-01T00:00:00.000Z');
  const result = safeSerialize(date);
  
  t.is(result, '2023-01-01T00:00:00.000Z');
});

test('safeSerialize handles RegExp objects', (t) => {
  const regex = /test/gi;
  const result = safeSerialize(regex);
  
  t.is(result, '/test/gi');
});

test('safeSerialize handles null and undefined', (t) => {
  t.is(safeSerialize(null), null);
  t.is(safeSerialize(undefined), undefined);
});

test('safeSerialize handles primitive types', (t) => {
  t.is(safeSerialize('string'), 'string');
  t.is(safeSerialize(123), 123);
  t.is(safeSerialize(true), true);
  t.is(safeSerialize(false), false);
});