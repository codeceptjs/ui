const test = require('ava');
const fs = require('fs').promises;
const path = require('path');
const getFile = require('../lib/api/get-file');

// Mock global codecept_dir
const testDir = path.join(__dirname, 'temp-fix');
global.codecept_dir = testDir;

test.before(async () => {
  // Create test directory and files
  await fs.mkdir(testDir, { recursive: true });
  await fs.writeFile(path.join(testDir, 'test.js'), `Feature('Test Feature');

Scenario('test scenario', async ({ I }) => {
  I.amOnPage('/');
  I.see('Hello');
});`);
});

test.after(async () => {
  // Clean up test directory
  try {
    await fs.rmdir(testDir, { recursive: true });
  } catch (err) {
    // Ignore cleanup errors
  }
});

test('getFile works with POST request body path', async (t) => {
  const req = {
    body: {
      path: 'test.js',
      line: 1
    }
  };
  
  let responseData = null;
  let statusCode = 200;
  
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
          return res;
        }
      };
    },
    json: (data) => {
      responseData = data;
    }
  };
  
  await getFile(req, res);
  
  t.is(statusCode, 200);
  t.truthy(responseData);
  t.is(responseData.success, true);
  t.truthy(responseData.source);
  t.true(responseData.source.includes("Feature('Test Feature')"));
  t.is(responseData.file, 'test.js');
});

test('getFile returns 400 when path is missing', async (t) => {
  const req = {
    body: {}
  };
  
  let responseData = null;
  let statusCode = 200;
  
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
          return res;
        }
      };
    }
  };
  
  await getFile(req, res);
  
  t.is(statusCode, 400);
  t.is(responseData.error, 'File parameter is required');
});