const test = require('ava');
const path = require('path');
const codeceptjsFactory = require('./index');

test.only('run a codeceptjs scenario', (t) => {
  const runner = codeceptjsFactory.createRunner(path.join(__dirname, '_fixtures'));
  
  console.log(runner.testFiles);

  t.truthy(runner);
  t.is(runner.testFiles.length, 1);
});
