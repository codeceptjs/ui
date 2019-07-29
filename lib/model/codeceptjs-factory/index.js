const debug = require('debug')('codepress:codeceptjs-factory');
const path = require('path');

// codepress must be run in testproject dir
const DefaultTestProjectDir = process.cwd();

const event = require(path.join(DefaultTestProjectDir, 'node_modules', 'codeceptjs', 'lib', 'event'));
const Container = require(path.join(DefaultTestProjectDir, 'node_modules', 'codeceptjs')).container;
const Codecept = require(path.join(DefaultTestProjectDir, 'node_modules', 'codeceptjs')).codecept;
const config = require(path.join(DefaultTestProjectDir, 'node_modules', 'codeceptjs')).config;

const opts = { steps: true };

module.exports = new class CodeceptjsFactory {
  constructor() {
    event.dispatcher.on(event.all.result, () => debug('event.all.result'));
    event.dispatcher.on(event.all.after, () => debug('event.all.after'));
  }

  createConfig(TestProjectDir = DefaultTestProjectDir, additionalConfig = {}) {
    const configPath = path.join(TestProjectDir, 'codecept.conf.js');
    debug('loading config from ${configPath}')

    config.load(configPath);
    config.append(additionalConfig);

    return config.get();
  }

  create() {
    config.load(path.join(DefaultTestProjectDir, 'codecept.conf.js'))
    const cfg = config.get();

    // create runner
    const codecept = new Codecept(cfg, opts);
  
    // initialize codeceptjs in current DefaultTestProjectDir
    codecept.initGlobals(DefaultTestProjectDir);
  
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

  createRunner(testProjectDir = DefaultTestProjectDir, additionalConfig = {}, opts = { steps: true }) {
    const cfg = this.createConfig(testProjectDir, additionalConfig);

    // create runner
    let codecept = new Codecept(cfg, opts);

    // initialize codeceptjs in current dir
    debug('initializing globals');
    codecept.initGlobals(testProjectDir);

    // create helpers, support files, mocha
    debug('creating helpers');
    Container.create(cfg, opts);

    // initialize listeners
    debug('running hooks');
    codecept.runHooks();

    // run bootstrap function from config
    debug('bootstrapping');
    codecept.runBootstrap();

    // load tests
    debug('loading tests');
    codecept.loadTests(cfg.tests);

    // run tests
    // codecept.run();
    return codecept;
  }
};
