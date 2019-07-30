const path = require('path');

// codepress must be run in testproject dir
const TestProject = process.cwd();

const container = require('codeceptjs').container;
const Codecept = require('codeceptjs').codecept;
const config = require('codeceptjs').config;

const defaultOpts = { steps: true };

// current instance
let instance;

module.exports = new class CodeceptjsFactory {
  constructor() {}

  createConfig() {
    config.load(path.join(TestProject, 'codecept.conf.js'))
    return config.get();
  }

  getInstance() {
    if (!instance) instance = this.create();
    return instance;
  }

  create(cfg = {}, opts = {}) {
    config.reset();
    config.load(path.join(TestProject, 'codecept.conf.js'))
    config.append(cfg);
    cfg = config.get();

    container.clear();
    // create runner
    const codecept = new Codecept(cfg, opts = Object.assign(opts, defaultOpts));
    
    // initialize codeceptjs in current TestProject
    codecept.initGlobals(TestProject);

    
    // create helpers, support files, mocha
    container.create(cfg, opts);
  
    // load tests
    codecept.loadTests(cfg.tests);

    return {
      config,
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
