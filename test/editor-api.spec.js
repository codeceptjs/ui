const test = require('ava');
const editorApi = require('../lib/api/editor');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Mock request/response objects for testing
const mockRequest = (params = {}, body = {}, query = {}) => ({
  params,
  body,
  query
});

const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  res.send = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

// Mock codeceptjs-factory
const mockConfig = {
  tests: os.tmpdir()
};

// Mock the dependency
require.cache[require.resolve('../lib/model/codeceptjs-factory')] = {
  exports: {
    getCodeceptjsConfig: () => mockConfig
  }
};

let testFilePath;

test.before(() => {
  // Create test file
  testFilePath = path.join(mockConfig.tests, 'test-editor.js');
  const testContent = `Feature('Editor API Tests');

Scenario('test scenario', async ({ I }) => {
  I.amOnPage('/test');
  I.see('Test');
});`;
  
  fs.writeFileSync(testFilePath, testContent);
});

test.after(() => {
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }
});

test('getScenarioSource - returns scenario source', async t => {
  const req = mockRequest({ file: 'test-editor.js', line: '3' });
  const res = mockResponse();
  
  await editorApi.getScenarioSource(req, res);
    
  t.is(res.data.success, true);
  t.truthy(res.data.data.source);
  t.true(res.data.data.source.includes('test scenario'));
  t.is(res.data.data.startLine, 3);
});

test('getScenarioSource - validates parameters', async t => {
  const req1 = mockRequest({ file: 'test-editor.js', line: 'invalid' });
  const res1 = mockResponse();
  
  await editorApi.getScenarioSource(req1, res1);
  t.is(res1.statusCode, 400);
    
  const req2 = mockRequest({ file: '', line: '3' });
  const res2 = mockResponse();
  
  await editorApi.getScenarioSource(req2, res2);
  t.is(res2.statusCode, 400);
});

test('getScenarioSource - security check prevents directory traversal', async t => {
  const req = mockRequest({ file: '../../../etc/passwd', line: '1' });
  const res = mockResponse();
  
  await editorApi.getScenarioSource(req, res);
  t.is(res.statusCode, 403);
});

test('updateScenario - updates scenario', async t => {
  const newScenario = `Scenario('updated scenario', async ({ I }) => {
  I.amOnPage('/updated');
  I.see('Updated');
})`;

  const req = mockRequest(
    { file: 'test-editor.js', line: '3' },
    { source: newScenario }
  );
  const res = mockResponse();
  
  await editorApi.updateScenario(req, res);
    
  t.is(res.data.success, true);
  t.is(res.data.message, 'Scenario updated successfully');
  
  // Verify file was actually updated
  const updatedContent = fs.readFileSync(testFilePath, 'utf8');
  t.true(updatedContent.includes('updated scenario'));
});

test('updateScenario - validates scenario structure', async t => {
  const invalidCode = 'console.log("not a scenario");';
  
  const req = mockRequest(
    { file: 'test-editor.js', line: '3' },
    { source: invalidCode }
  );
  const res = mockResponse();
  
  await editorApi.updateScenario(req, res);
  t.is(res.statusCode, 500);
});

test('getFileContent - returns full file content', async t => {
  const req = mockRequest({ file: 'test-editor.js' });
  const res = mockResponse();
  
  await editorApi.getFileContent(req, res);
    
  t.is(res.data.success, true);
  t.truthy(res.data.data.content);
  t.true(res.data.data.content.includes('Feature(\'Editor API Tests\')'));
});

test('updateFileContent - updates full file', async t => {
  const newContent = `Feature('Updated Feature');

Before(async ({ I }) => {
  I.amOnPage('/setup');
});

Scenario('new scenario', async ({ I }) => {
  I.see('New');
});`;

  const req = mockRequest(
    { file: 'test-editor.js' },
    { content: newContent }
  );
  const res = mockResponse();
  
  await editorApi.updateFileContent(req, res);
    
  t.is(res.data.success, true);
  
  // Verify content was updated
  const updatedContent = fs.readFileSync(testFilePath, 'utf8');
  t.is(updatedContent, newContent);
});

test('getAutocompleteSuggestions - returns suggestions', async t => {
  const req = mockRequest();
  const res = mockResponse();
  
  await editorApi.getAutocompleteSuggestions(req, res);
    
  t.is(res.data.success, true);
  t.truthy(res.data.data.playwright);
  t.truthy(res.data.data.structure);
  t.truthy(res.data.data.patterns);
  
  t.true(Array.isArray(res.data.data.playwright));
  t.true(res.data.data.playwright.length > 0);
});

test('API error handling - file not found', async t => {
  const req = mockRequest({ file: 'nonexistent.js' });
  const res = mockResponse();
  
  await editorApi.getFileContent(req, res);
  t.is(res.statusCode, 500);
});

test('API error handling - missing parameters', async t => {
  const req1 = mockRequest(
    { file: 'test-editor.js', line: '3' },
    {} // Missing source
  );
  const res1 = mockResponse();
  
  await editorApi.updateScenario(req1, res1);
  t.is(res1.statusCode, 400);
    
  const req2 = mockRequest(
    { file: 'test-editor.js' },
    {} // Missing content
  );
  const res2 = mockResponse();
  
  await editorApi.updateFileContent(req2, res2);
  t.is(res2.statusCode, 400);
});