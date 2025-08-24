const test = require('ava');

// Mock the dependencies that can cause hanging processes
const mockEvent = {
  dispatcher: {
    once: () => {}, // No-op to prevent hanging
    removeAllListeners: () => {}
  },
  all: {
    result: 'test.result'
  }
};

const mockWsEvents = {
  codeceptjs: {
    exit: () => {} // No-op to prevent socket connections
  }
};

// Mock the modules before requiring stop.js
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === 'codeceptjs') {
    return { event: mockEvent };
  }
  if (id === '../model/ws-events') {
    return mockWsEvents;
  }
  return originalRequire.apply(this, arguments);
};

const stop = require('./stop');

// Restore original require after loading
Module.prototype.require = originalRequire;

test('should return OK status when no global runner exists', async (t) => {
  // Add timeout to prevent hanging
  const timeout = setTimeout(() => {
    t.fail('Test timed out');
  }, 2000);

  const originalRunner = global.runner;
  global.runner = undefined;
  
  let statusCode;
  let responseData;
  
  const req = {};
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        send: (data) => {
          responseData = data;
          return res;
        }
      };
    }
  };
  
  try {
    await stop(req, res);
    
    t.is(statusCode, 200);
    t.is(responseData, 'OK');
    clearTimeout(timeout);
  } finally {
    global.runner = originalRunner;
    clearTimeout(timeout);
  }
});

test('should call abort on global runner when it exists', async (t) => {
  // Add timeout to prevent hanging
  const timeout = setTimeout(() => {
    t.fail('Test timed out');
  }, 2000);

  const originalRunner = global.runner;
  let abortCalled = false;
  
  global.runner = {
    abort: () => {
      abortCalled = true;
    },
    _abort: true
  };
  
  let statusCode;
  let responseData;
  
  const req = {};
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        send: (data) => {
          responseData = data;
          return res;
        }
      };
    }
  };
  
  try {
    await stop(req, res);
    
    t.true(abortCalled);
    t.is(statusCode, 200);
    t.is(responseData, 'OK');
    clearTimeout(timeout);
  } finally {
    global.runner = originalRunner;
    clearTimeout(timeout);
  }
});

test('should handle null global runner gracefully', async (t) => {
  // Add timeout to prevent hanging
  const timeout = setTimeout(() => {
    t.fail('Test timed out');
  }, 2000);

  const originalRunner = global.runner;
  global.runner = null;
  
  let statusCode;
  let responseData;
  
  const req = {};
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        send: (data) => {
          responseData = data;
          return res;
        }
      };
    }
  };
  
  try {
    await stop(req, res);
    
    t.is(statusCode, 200);
    t.is(responseData, 'OK');
    clearTimeout(timeout);
  } finally {
    global.runner = originalRunner;
    clearTimeout(timeout);
  }
});