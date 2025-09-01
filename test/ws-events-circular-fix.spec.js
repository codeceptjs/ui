const test = require('ava');

// Mock the Socket.IO environment to test ws-events without actually connecting
process.env.NODE_ENV = 'test';

const wsEvents = require('../lib/model/ws-events');

test('ws-events can emit error objects with circular references without crashing', (t) => {
  // Create an error object with a circular reference
  const error = new Error('Test error with circular reference');
  error.code = 'CIRCULAR_ERROR';
  error.cause = error; // Create circular reference
  
  // This should not throw "Maximum call stack size exceeded"
  t.notThrows(() => {
    wsEvents.console.jsError(error);
  });
  
  t.notThrows(() => {
    wsEvents.console.error(error);
  });
  
  t.notThrows(() => {
    wsEvents.codeceptjs.error(error);
  });
});

test('ws-events can emit objects with circular references without crashing', (t) => {
  // Create an object with circular reference
  const testData = {
    name: 'test',
    id: 123,
    steps: []
  };
  testData.parent = testData; // Create circular reference
  
  // This should not throw "Maximum call stack size exceeded"
  t.notThrows(() => {
    wsEvents.rtr.testBefore(testData);
  });
  
  t.notThrows(() => {
    wsEvents.rtr.testAfter(testData);
  });
  
  t.notThrows(() => {
    wsEvents.rtr.stepBefore(testData);
  });
  
  t.notThrows(() => {
    wsEvents.rtr.stepAfter(testData);
  });
});

test('ws-events can handle complex nested objects', (t) => {
  // Create a deeply nested object that could potentially cause issues
  const complexData = {
    test: {
      suite: {
        title: 'Complex Test',
        tests: [
          { title: 'Test 1', steps: [] },
          { title: 'Test 2', steps: [] }
        ]
      }
    },
    error: new Error('Complex error'),
    args: [1, 2, 3, { nested: { deep: { object: true } } }]
  };
  
  // Add circular reference
  complexData.test.suite.parent = complexData;
  complexData.error.context = complexData;
  
  t.notThrows(() => {
    wsEvents.network.failedRequest(complexData);
  });
  
  t.notThrows(() => {
    wsEvents.codeceptjs.started(complexData);
  });
  
  t.notThrows(() => {
    wsEvents.codeceptjs.exit(complexData);
  });
});