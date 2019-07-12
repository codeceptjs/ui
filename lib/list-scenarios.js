const path = require('path');
const fs = require('fs');

const TestProject = process.cwd();
const Container = require(path.join(TestProject, 'node_modules', 'codeceptjs')).container;
const Codecept = require(path.join(TestProject, 'node_modules', 'codeceptjs')).codecept;

const config = require(path.join(TestProject, 'node_modules', 'codeceptjs')).config;
config.load(path.join(TestProject, 'codecept.conf.js'))

const opts = { steps: true };


const listTestFiles = () => {
  const cfg = config.get();

  // create runner
  let codecept = new Codecept(cfg, opts);

  // initialize codeceptjs in current TestProject
  codecept.initGlobals(TestProject);

  // create helpers, support files, mocha
  Container.create(cfg, opts);

  // load tests
  codecept.loadTests(cfg.tests);

  return codecept.testFiles;
}

const listScenarios = () => {
  const testFiles = listTestFiles();

  return testFiles.map(tf => {
    const content = fs.readFileSync(tf, 'utf-8');
    return content
      .split('\n')
      .filter(l => l.match(/^\s*(Scenario|Feature)\s*\(/));

  })
}

listScenarios();


module.exports = {
  listTestFiles,
  listScenarios,
}