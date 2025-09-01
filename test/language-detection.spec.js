const test = require('ava');
const { detectLanguage, getLanguageDisplayName } = require('../src/utils/languageDetection.js');

test('detectLanguage › should detect JavaScript files correctly', t => {
  const result = detectLanguage('test.js');
  t.is(result.monaco, 'javascript');
  t.is(result.highlightjs, 'javascript');
});

test('detectLanguage › should detect TypeScript files correctly', t => {
  const result = detectLanguage('component.ts');
  t.is(result.monaco, 'typescript');
  t.is(result.highlightjs, 'typescript');
});

test('detectLanguage › should detect JSON files correctly', t => {
  const result = detectLanguage('package.json');
  t.is(result.monaco, 'json');
  t.is(result.highlightjs, 'json');
});

test('detectLanguage › should detect feature files correctly', t => {
  const result = detectLanguage('login.feature');
  t.is(result.monaco, 'gherkin');
  t.is(result.highlightjs, 'gherkin');
});

test('detectLanguage › should detect YAML files correctly', t => {
  const result = detectLanguage('config.yaml');
  t.is(result.monaco, 'yaml');
  t.is(result.highlightjs, 'yaml');

  const result2 = detectLanguage('config.yml');
  t.is(result2.monaco, 'yaml');
  t.is(result2.highlightjs, 'yaml');
});

test('detectLanguage › should detect CSS files correctly', t => {
  const result = detectLanguage('styles.css');
  t.is(result.monaco, 'css');
  t.is(result.highlightjs, 'css');
});

test('detectLanguage › should detect HTML files correctly', t => {
  const result = detectLanguage('index.html');
  t.is(result.monaco, 'html');
  t.is(result.highlightjs, 'html');
});

test('detectLanguage › should detect Markdown files correctly', t => {
  const result = detectLanguage('README.md');
  t.is(result.monaco, 'markdown');
  t.is(result.highlightjs, 'markdown');
});

test('detectLanguage › should handle files without extensions by defaulting to JavaScript', t => {
  const result = detectLanguage('Dockerfile');
  t.is(result.monaco, 'javascript');
  t.is(result.highlightjs, 'javascript');
});

test('detectLanguage › should handle unknown extensions by defaulting to JavaScript', t => {
  const result = detectLanguage('file.unknown');
  t.is(result.monaco, 'javascript');
  t.is(result.highlightjs, 'javascript');
});

test('detectLanguage › should handle null/undefined input by defaulting to JavaScript', t => {
  const result1 = detectLanguage(null);
  t.is(result1.monaco, 'javascript');
  t.is(result1.highlightjs, 'javascript');

  const result2 = detectLanguage(undefined);
  t.is(result2.monaco, 'javascript');
  t.is(result2.highlightjs, 'javascript');

  const result3 = detectLanguage('');
  t.is(result3.monaco, 'javascript');
  t.is(result3.highlightjs, 'javascript');
});

test('detectLanguage › should handle full file paths correctly', t => {
  const result = detectLanguage('/path/to/my/test.feature');
  t.is(result.monaco, 'gherkin');
  t.is(result.highlightjs, 'gherkin');
});

test('getLanguageDisplayName › should return correct display names', t => {
  t.is(getLanguageDisplayName('test.js'), 'JavaScript');
  t.is(getLanguageDisplayName('component.ts'), 'TypeScript');
  t.is(getLanguageDisplayName('package.json'), 'JSON');
  t.is(getLanguageDisplayName('login.feature'), 'Gherkin (BDD)');
  t.is(getLanguageDisplayName('config.yaml'), 'YAML');
  t.is(getLanguageDisplayName('styles.css'), 'CSS');
  t.is(getLanguageDisplayName('index.html'), 'HTML');
  t.is(getLanguageDisplayName('README.md'), 'Markdown');
  t.is(getLanguageDisplayName('unknown.ext'), 'JavaScript');
});

test('detectLanguage › should be case-insensitive for extensions', t => {
  const result1 = detectLanguage('TEST.JS');
  t.is(result1.monaco, 'javascript');
  
  const result2 = detectLanguage('Component.TS');
  t.is(result2.monaco, 'typescript');
  
  const result3 = detectLanguage('Config.YAML');
  t.is(result3.monaco, 'yaml');
});