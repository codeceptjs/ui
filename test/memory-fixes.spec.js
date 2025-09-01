const test = require('ava');
const safeSerialize = require('../lib/utils/safe-serialize');

test('safeSerialize handles large arrays without memory issues', (t) => {
  // Create a large array that could cause memory issues
  const largeArray = new Array(2000).fill(0).map((_, i) => ({ index: i, data: 'test data' }));
  
  const result = safeSerialize(largeArray);
  
  // Should be truncated to 1000 items plus truncation message
  t.is(result.length, 1001);
  t.is(result[1000], '[Array truncated - original length: 2000]');
  t.is(result[0].index, 0);
  t.is(result[999].index, 999);
});

test('safeSerialize limits stack trace length for Error objects', (t) => {
  const error = new Error('Test error');
  // Create a very long stack trace
  error.stack = 'Error: Test error\n' + 'at '.repeat(1000) + 'very long stack trace';
  
  const result = safeSerialize(error);
  
  t.is(result.name, 'Error');
  t.is(result.message, 'Test error');
  t.true(result.stack.length <= 2000);
  t.is(result.type, 'Error');
});

test('safeSerialize handles objects with many properties', (t) => {
  const objWithManyProps = {};
  for (let i = 0; i < 200; i++) {
    objWithManyProps[`prop${i}`] = `value${i}`;
  }
  
  const result = safeSerialize(objWithManyProps);
  const keys = Object.keys(result);
  
  // Should be limited to 100 properties plus truncation message
  t.true(keys.length <= 101);
  t.true(keys.includes('[...truncated]'));
});

test('safeSerialize handles Function objects', (t) => {
  function namedFunction() { return 'test'; }
  const anonymousFunction = () => 'test';
  
  const result1 = safeSerialize(namedFunction);
  const result2 = safeSerialize(anonymousFunction);
  
  t.is(result1, '[Function: namedFunction]');
  t.is(result2, '[Function: anonymousFunction]'); // Arrow functions get assigned variable name
});

test('safeSerialize handles Buffer objects with size info', (t) => {
  if (typeof Buffer !== 'undefined') {
    const buffer = Buffer.from('Hello World', 'utf8');
    const result = safeSerialize(buffer);
    
    t.is(result, '[Buffer: 11 bytes]');
  } else {
    t.pass('Buffer not available in this environment');
  }
});

test('safeSerialize backwards compatibility with existing maxDepth parameter', (t) => {
  const circularObj = { name: 'test' };
  circularObj.self = circularObj;
  
  // Should work the same as before with existing parameter
  const result = safeSerialize(circularObj, 50);
  
  t.is(result.name, 'test');
  t.is(result.self, '[Circular Reference]');
});