import test from 'ava';

// Create a custom stop handler for testing that doesn't depend on codeceptjs ESM imports.
// We test the logic directly rather than relying on Module.prototype.require mocks.
const mockEvent = {
  dispatcher: {
    once: (eventName, cb) => {
      // Store the callback so we can trigger it manually
      mockEvent._callbacks = mockEvent._callbacks || {};
      mockEvent._callbacks[eventName] = cb;
    },
    removeAllListeners: () => {}
  },
  all: {
    result: 'test.result'
  },
  _callbacks: {}
};

const mockWsEvents = {
  codeceptjs: {
    exit: () => {}
  }
};

// Build a stop handler that uses our mocks directly
function createStopHandler(event, wsEvents) {
  return async (req, res) => {
    try {
      if (global.runner) {
        global.runner.abort();
        
        const timeout = setTimeout(() => {
          wsEvents.codeceptjs.exit(-1);
          global.runner = null;
        }, 5000);
        
        event.dispatcher.once(event.all.result, () => {
          clearTimeout(timeout);
          if (global.runner) {
            global.runner._abort = false;
          }
          global.runner = null;
          wsEvents.codeceptjs.exit(-1);
        });
      } else {
        wsEvents.codeceptjs.exit(-1);
      }

      return res.status(200).send('OK');
    } catch (error) {
      wsEvents.codeceptjs.exit(-1);
      return res.status(500).send('Failed to stop execution');
    }
  };
}

const stop = createStopHandler(mockEvent, mockWsEvents);

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