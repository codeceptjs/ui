const test = require('ava');
const throttled = require('./throttling');

test('should call function immediately on first call', (t) => {
  let callCount = 0;
  const fn = () => { callCount++; };
  const throttledFn = throttled(100, fn);
  
  throttledFn();
  
  t.is(callCount, 1);
});

test('should not call function again within delay period', (t) => {
  let callCount = 0;
  const fn = () => { callCount++; };
  const throttledFn = throttled(100, fn);
  
  throttledFn();
  throttledFn(); // Should be ignored
  throttledFn(); // Should be ignored
  
  t.is(callCount, 1);
});

test('should call function after delay period has passed', (t) => {
  return new Promise((resolve) => {
    let callCount = 0;
    const fn = () => { callCount++; };
    const throttledFn = throttled(50, fn);
    
    throttledFn(); // First call
    t.is(callCount, 1);
    
    setTimeout(() => {
      throttledFn(); // Should be called after delay
      t.is(callCount, 2);
      resolve();
    }, 60);
  });
});

test('should pass arguments to the original function', (t) => {
  let receivedArgs = [];
  const fn = (...args) => { receivedArgs = args; };
  const throttledFn = throttled(100, fn);
  
  throttledFn('arg1', 'arg2', 'arg3');
  
  t.deepEqual(receivedArgs, ['arg1', 'arg2', 'arg3']);
});

test('should return the result of the original function', (t) => {
  const fn = (a, b) => a + b;
  const throttledFn = throttled(100, fn);
  
  const result = throttledFn(5, 3);
  
  t.is(result, 8);
});

test('should return undefined when throttled', (t) => {
  const fn = () => 'result';
  const throttledFn = throttled(100, fn);
  
  const firstResult = throttledFn();
  const secondResult = throttledFn(); // Should be throttled
  
  t.is(firstResult, 'result');
  t.is(secondResult, undefined);
});

test('should work with different delay values', (t) => {
  return new Promise((resolve) => {
    let shortCallCount = 0;
    let longCallCount = 0;
    
    const shortFn = () => { shortCallCount++; };
    const longFn = () => { longCallCount++; };
    
    const shortThrottled = throttled(20, shortFn);
    const longThrottled = throttled(100, longFn);
    
    shortThrottled();
    longThrottled();
    
    setTimeout(() => {
      shortThrottled(); // Should work after 20ms
      longThrottled(); // Should still be throttled after 30ms
      
      t.is(shortCallCount, 2);
      t.is(longCallCount, 1);
      resolve();
    }, 30);
  });
});

test('should preserve function context when bound', (t) => {
  const obj = {
    value: 42,
    getValue: function() { return this.value; }
  };
  
  const throttledGetValue = throttled(100, obj.getValue.bind(obj));
  
  const result = throttledGetValue();
  
  t.is(result, 42);
});

test('should handle zero delay', (t) => {
  let callCount = 0;
  const fn = () => { callCount++; };
  const throttledFn = throttled(0, fn);
  
  throttledFn();
  throttledFn();
  throttledFn();
  
  // With zero delay, all calls should go through
  t.is(callCount, 3);
});

test('should handle negative delay as zero', (t) => {
  let callCount = 0;
  const fn = () => { callCount++; };
  const throttledFn = throttled(-10, fn);
  
  throttledFn();
  throttledFn();
  
  // Negative delay should behave like zero delay
  t.is(callCount, 2);
});