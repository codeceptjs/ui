const test = require('ava');
const stop = require('./stop');

test('should return OK status when no global runner exists', async (t) => {
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
  } finally {
    global.runner = originalRunner;
  }
});

test('should call abort on global runner when it exists', async (t) => {
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
  } finally {
    global.runner = originalRunner;
  }
});

test('should handle null global runner gracefully', async (t) => {
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
  } finally {
    global.runner = originalRunner;
  }
});