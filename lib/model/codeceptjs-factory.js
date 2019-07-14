const path = require('path');

// codepress must be run in testproject dir
const TestProject = process.cwd();

const Container = require(path.join(TestProject, 'node_modules', 'codeceptjs')).container;
const Codecept = require(path.join(TestProject, 'node_modules', 'codeceptjs')).codecept;
const config = require(path.join(TestProject, 'node_modules', 'codeceptjs')).config;

const opts = { steps: true };

module.exports = new class CodeceptjsFactory {
  constructor() {}

  create() {
    config.load(path.join(TestProject, 'codecept.conf.js'))
    const cfg = config.get();

    // create runner
    const codecept = new Codecept(cfg, opts);
  
    // initialize codeceptjs in current TestProject
    codecept.initGlobals(TestProject);
  
    // create helpers, support files, mocha
    const container = Container.create(cfg, opts);
  
    // load tests
    codecept.loadTests(cfg.tests);

    return {
      config: cfg,
      codecept,
      container,
    }
  }

  createRunner() {
    config.load(path.join(TestProject, 'codecept.conf.js'))
    const cfg = config.get();

    // create runner
    let codecept = new Codecept(config, opts);

    // initialize codeceptjs in current dir
    codecept.initGlobals(TestProject);

    // create helpers, support files, mocha
    Container.create(config, opts);

    // initialize listeners
    codecept.runHooks();

    // run bootstrap function from config
    codecept.runBootstrap();

    // load tests
    codecept.loadTests(cfg.tests);

    // run tests
    codecept.run();
  }
};
