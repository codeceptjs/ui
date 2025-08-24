const test = require('ava');
const path = require('path');
const absolutizePaths = require('./absolutize-paths');

test.beforeEach((t) => {
  // Store original global.codecept_dir
  t.context.originalCodeceptDir = global.codecept_dir;
});

test.afterEach((t) => {
  // Restore original global.codecept_dir
  global.codecept_dir = t.context.originalCodeceptDir;
});

test('should convert relative paths to absolute paths', (t) => {
  global.codecept_dir = '/test/project';
  
  const input = {
    configFile: 'codecept.conf.js',
    outputDir: 'output',
    testsDir: './features'
  };
  
  const result = absolutizePaths(input);
  
  t.is(result.configFile, path.resolve('/test/project', 'codecept.conf.js'));
  t.is(result.outputDir, path.resolve('/test/project', 'output'));
  t.is(result.testsDir, path.resolve('/test/project', './features'));
});

test('should leave absolute paths unchanged', (t) => {
  global.codecept_dir = '/test/project';
  
  const input = {
    configFile: '/absolute/path/codecept.conf.js',
    outputDir: '/absolute/output',
    testsDir: '/absolute/features'
  };
  
  const result = absolutizePaths(input);
  
  t.is(result.configFile, '/absolute/path/codecept.conf.js');
  t.is(result.outputDir, '/absolute/output');
  t.is(result.testsDir, '/absolute/features');
});

test('should handle mixed absolute and relative paths', (t) => {
  global.codecept_dir = '/test/project';
  
  const input = {
    configFile: '/absolute/codecept.conf.js',
    outputDir: 'relative/output',
    testsDir: '/absolute/features'
  };
  
  const result = absolutizePaths(input);
  
  t.is(result.configFile, '/absolute/codecept.conf.js');
  t.is(result.outputDir, path.resolve('/test/project', 'relative/output'));
  t.is(result.testsDir, '/absolute/features');
});

test('should handle empty strings by leaving them unchanged', (t) => {
  global.codecept_dir = '/test/project';
  
  const input = {
    configFile: '',
    outputDir: 'output'
  };
  
  const result = absolutizePaths(input);
  
  t.is(result.configFile, '');
  t.is(result.outputDir, path.resolve('/test/project', 'output'));
});

test('should handle null values by leaving them unchanged', (t) => {
  global.codecept_dir = '/test/project';
  
  const input = {
    configFile: null,
    outputDir: 'output',
    testsDir: undefined
  };
  
  const result = absolutizePaths(input);
  
  t.is(result.configFile, null);
  t.is(result.outputDir, path.resolve('/test/project', 'output'));
  t.is(result.testsDir, undefined);
});

test('should handle non-string values by leaving them unchanged', (t) => {
  global.codecept_dir = '/test/project';
  
  const input = {
    port: 8080,
    enabled: true,
    paths: ['test1', 'test2'],
    configFile: 'codecept.conf.js'
  };
  
  const result = absolutizePaths(input);
  
  t.is(result.port, 8080);
  t.is(result.enabled, true);
  t.deepEqual(result.paths, ['test1', 'test2']);
  t.is(result.configFile, path.resolve('/test/project', 'codecept.conf.js'));
});

test('should work when global.codecept_dir is not set', (t) => {
  global.codecept_dir = undefined;
  
  const input = {
    configFile: 'codecept.conf.js',
    outputDir: './output'
  };
  
  const result = absolutizePaths(input);
  
  t.is(result.configFile, path.resolve('', 'codecept.conf.js'));
  t.is(result.outputDir, path.resolve('', './output'));
});

test('should return the same object (mutating original)', (t) => {
  global.codecept_dir = '/test/project';
  
  const input = {
    configFile: 'codecept.conf.js'
  };
  
  const result = absolutizePaths(input);
  
  t.is(result, input); // Same object reference
  t.is(input.configFile, path.resolve('/test/project', 'codecept.conf.js'));
});

test('should handle empty object', (t) => {
  const input = {};
  const result = absolutizePaths(input);
  
  t.deepEqual(result, {});
  t.is(result, input);
});