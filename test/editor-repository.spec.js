const test = require('ava');
const editorRepository = require('../lib/model/editor-repository');
const fs = require('fs');
const path = require('path');
const os = require('os');

let testDir;
let testFile;

test.before(() => {
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeceptui-editor-test-'));
  testFile = path.join(testDir, 'test.js');
});

test.after(() => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
});

test('getScenarioSource - extracts scenario correctly', t => {
  const content = `Feature('Login Tests');

Scenario('should login successfully', async ({ I }) => {
  I.amOnPage('/login');
  I.fillField('email', 'user@example.com');
  I.fillField('password', 'password123');
  I.click('Login');
  I.see('Welcome');
});

Scenario('should show error for invalid credentials', async ({ I }) => {
  I.amOnPage('/login');
  I.fillField('email', 'invalid@example.com');
  I.click('Login');
  I.see('Invalid credentials');
});`;

  fs.writeFileSync(testFile, content);
  
  const result = editorRepository.getScenarioSource(testFile, 3);
  
  t.truthy(result.source);
  t.is(result.startLine, 3);
  t.is(result.endLine, 9);
  t.true(result.source.includes('should login successfully'));
  t.true(result.source.includes('I.amOnPage(\'/login\')'));
});

test('getScenarioSource - handles Scenario.only and Scenario.skip', t => {
  const content = `Feature('Test Suite');

Scenario.only('focused test', async ({ I }) => {
  I.amOnPage('/test');
  I.see('Test');
});

Scenario.skip('skipped test', async ({ I }) => {
  I.amOnPage('/skip');
});`;

  fs.writeFileSync(testFile, content);
  
  const result1 = editorRepository.getScenarioSource(testFile, 3);
  t.true(result1.source.includes('Scenario.only'));
  
  const result2 = editorRepository.getScenarioSource(testFile, 8);
  t.true(result2.source.includes('Scenario.skip'));
});

test('updateScenario - updates scenario content correctly', t => {
  const originalContent = `Feature('Update Tests');

Scenario('original test', async ({ I }) => {
  I.amOnPage('/original');
  I.see('Original');
});`;

  const newScenarioCode = `Scenario('updated test', async ({ I }) => {
  I.amOnPage('/updated');
  I.see('Updated');
  I.click('Submit');
})`;

  fs.writeFileSync(testFile, originalContent);
  
  const success = editorRepository.updateScenario(testFile, 3, newScenarioCode);
  
  t.true(success);
  
  const updatedContent = fs.readFileSync(testFile, 'utf8');
  t.true(updatedContent.includes('updated test'));
  t.true(updatedContent.includes('I.click(\'Submit\')'));
  t.false(updatedContent.includes('original test'));
  
  // Verify backup was created
  const backupFiles = fs.readdirSync(testDir).filter(f => f.includes('.backup.'));
  t.is(backupFiles.length, 1);
});

test('updateScenario - validates scenario structure', t => {
  const content = `Scenario('test', async ({ I }) => {
  I.amOnPage('/test');
});`;

  fs.writeFileSync(testFile, content);
  
  const invalidCode = `console.log('not a scenario');`;
  
  const error = t.throws(() => {
    editorRepository.updateScenario(testFile, 1, invalidCode);
  });
  
  t.true(error.message.includes('Scenario()'));
});

test('getFileContent - reads full file content', t => {
  const content = `Feature('File Tests');

Scenario('test 1', async ({ I }) => {
  I.amOnPage('/test1');
});

Scenario('test 2', async ({ I }) => {
  I.amOnPage('/test2');
});`;

  fs.writeFileSync(testFile, content);
  
  const result = editorRepository.getFileContent(testFile);
  
  t.is(result, content);
});

test('updateFileContent - updates full file with backup', t => {
  const originalContent = `Feature('Original');
Scenario('test', async ({ I }) => {});`;

  const newContent = `Feature('Updated');
Before(async ({ I }) => {
  I.amOnPage('/setup');
});

Scenario('new test', async ({ I }) => {
  I.see('Updated');
});`;

  fs.writeFileSync(testFile, originalContent);
  
  const success = editorRepository.updateFileContent(testFile, newContent);
  
  t.true(success);
  
  const updatedContent = fs.readFileSync(testFile, 'utf8');
  t.is(updatedContent, newContent);
  
  // Verify backup exists
  const backupFiles = fs.readdirSync(testDir).filter(f => f.includes('.backup.'));
  t.is(backupFiles.length, 1);
});

test('cleanupBackups - keeps only 5 most recent backups', t => {
  const content = 'test content';
  fs.writeFileSync(testFile, content);
  
  // Create 7 backup files with different timestamps
  const backupTimes = [1000, 2000, 3000, 4000, 5000, 6000, 7000];
  backupTimes.forEach(time => {
    const backupPath = `${testFile}.backup.${time}`;
    fs.writeFileSync(backupPath, `backup-${time}`);
  });
  
  editorRepository.cleanupBackups(testFile);
  
  // Should have only 5 backups remaining
  const backupFiles = fs.readdirSync(testDir).filter(f => f.includes('.backup.'));
  t.is(backupFiles.length, 5);
  
  // Should keep the 5 most recent (3000, 4000, 5000, 6000, 7000)
  const remainingTimestamps = backupFiles.map(f => parseInt(f.split('.backup.')[1])).sort();
  t.deepEqual(remainingTimestamps, [3000, 4000, 5000, 6000, 7000]);
});

test('getAutocompleteSuggestions - returns CodeceptJS suggestions', t => {
  const suggestions = editorRepository.getAutocompleteSuggestions();
  
  t.truthy(suggestions.playwright);
  t.truthy(suggestions.structure);
  t.truthy(suggestions.patterns);
  
  t.true(suggestions.playwright.includes('I.amOnPage(url)'));
  t.true(suggestions.playwright.includes('I.click(locator)'));
  t.true(suggestions.structure.includes('Scenario(\'scenario name\', async ({ I }) => {})'));
  t.true(suggestions.patterns.includes('pause()'));
});

test('error handling - file not found', t => {
  const nonExistentFile = path.join(testDir, 'does-not-exist.js');
  
  const error = t.throws(() => {
    editorRepository.getScenarioSource(nonExistentFile, 1);
  });
  
  t.truthy(error);
});

test('error handling - scenario not found at line', t => {
  const content = `Feature('No Scenario Tests');

// Just comments here
// No actual scenarios`;

  fs.writeFileSync(testFile, content);
  
  const error = t.throws(() => {
    editorRepository.getScenarioSource(testFile, 3);
  });
  
  t.true(error.message.includes('No Scenario found'));
});