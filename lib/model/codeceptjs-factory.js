const debug = require('debug')('codeceptjs:codeceptjs-factory');
const path = require('path');
const { codecept: Codecept, container, config } = require('codeceptjs');

const defaultOpts = {
  // verbose: true,
};

let TestProject = process.cwd();
// current instance
let instance;

module.exports = new class CodeceptjsFactory {
  constructor(configFile = 'codecept.conf.js') {
    this.configFile = configFile;
  }

  loadCodeceptJSHelpers() {
    debug('Loading helpers...');
    const RealtimeReporterHelper = require('../codeceptjs/realtime-reporter.helper');
    const NetworkRecorderHelper = require('../codeceptjs/network-recorder.helper');
    const ConsoleRecorderHelper = require('../codeceptjs/console-recorder.helper');
    const SingleSessionHelper = require('../codeceptjs/single-session.helper');
    const pause = require('./../codeceptjs/brk');

    const reporterHelper = new RealtimeReporterHelper();
    const networkHelper = new NetworkRecorderHelper();
    const consoleHelper = new ConsoleRecorderHelper();
    const singleSessionHelper = new SingleSessionHelper();

    reporterHelper._init();
    networkHelper._init();
    consoleHelper._init();
    singleSessionHelper._init();

    global.pause = pause;

    return {
      helpers: {
        RealtimeReporterHelper: reporterHelper,
        // NetworkRecorderHelper: networkHelper,
        ConsoleRecorderHelper: consoleHelper,
        SingleSessionHelper: singleSessionHelper,
      }
    };
  }

  getInstance() {
    if (!instance) throw new Error('CodeceptJS is not initialized, initialize it with create()');
    return instance;
  }

  getConfigFile() {
    return this.configFile;
  }

  setConfigFile(configFile) {
    this.configFile = configFile;
  }

  getRootDir() {
    return TestProject;
  }

  setRootDir(rootDir) {
    TestProject = rootDir;
  }

  async create(cfg = {}, opts = {}) {
    debug('Creating codeceptjs instance...', cfg);

    config.reset();
    config.load(this.getConfigFile());
    config.append(cfg);
    cfg = config.get();

    debug('Using CodeceptJS config', cfg);

    container.clear();
    // create runner
    const codecept = new Codecept(cfg, opts = Object.assign(opts, defaultOpts));

    // initialize codeceptjs in current TestProject
    codecept.initGlobals(TestProject);

    // create helpers, support files, mocha
    container.create(cfg, opts);

    this.codeceptjsHelpersConfig = this.loadCodeceptJSHelpers(container);
    container.append(this.codeceptjsHelpersConfig);

    debug('Running hooks...');
    codecept.runHooks();

    await codecept.bootstrap();

    // load tests
    debug('Loading tests...');
    codecept.loadTests();


    instance = {
      config,
      codecept,
      container,
    };
    return instance;
  }

  unrequireFile(filePath) {
    filePath = path.join(this.getRootDir(), filePath);
    let modulePath;
    try {
      modulePath = require.resolve(filePath);
    } catch (err) {
      return;
    }
    if (require.cache[modulePath]) {
      delete require.cache[modulePath];
    }
  }

  resetSuites() {
    const { container } = this.getInstance();
    const mocha = container.mocha();

    mocha.unloadFiles();
    mocha.suite.cleanReferences();
    mocha.suite.suites = [];
  }

  reloadSuites() {
    const { container, codecept } = this.getInstance();

    const mocha = container.mocha();

    this.resetSuites();

    // Reload
    mocha.files = codecept.testFiles;
    mocha.loadFiles();

    // mocha.suites.forEach(s => s._onlyTests = []);
    return mocha.suite.suites;
  }

  cleanupSupportObject(supportName) {
    const { container, config } = this.getInstance();
    const includesConfig = config.get('include');
    if (!includesConfig[supportName]) return;
    const support = container.support();
    delete support[supportName];
  }

  reloadConfig(configHooks = null) {
    const { config, container } = this.getInstance();
    config.reset();
    if (configHooks) configHooks();
    config.load(this.getConfigFile());

    const helpersConfig = config.get('helpers');

    for (const helperName in container.helpers()) {
      try {
        container.helpers(helperName)._setConfig(helpersConfig[helperName]);
      } catch (e) {
        debug(`Cannot run _setConfig due to: ${e.message}`);
      }
    }

    Object.keys(config.get('include')).forEach(s => this.cleanupSupportObject(s));
    debug('Updated config file. Refreshing...', );
  }

  reloadConfigIfNecessary(filePath) {
    if (filePath === this.getConfigFile()) {
      this.reloadConfig();
    }
  }

  reloadSupportObjectIfNecessary(filePath) {
    const { config } = this.getInstance();
    // if it is a support object => reinclude it
    Object.entries(config.get('include'))
      .filter(e => e[1] === path.join(this.getRootDir(), filePath))
      .forEach(e => this.cleanupSupportObject(e[0]));
  }
};
