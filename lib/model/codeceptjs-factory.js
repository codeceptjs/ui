import Debug from 'debug';
const debug = Debug('codeceptjs:codeceptjs-factory');
import path from 'path';
import { createRequire } from 'module';
import { codeceptjsModules } from '../codeceptjs/codeceptjs-imports.js';
import createRealtimeReporterHelper from '../codeceptjs/realtime-reporter.helper.js';
import createNetworkRecorderHelper from '../codeceptjs/network-recorder.helper.js';
import createConsoleRecorderHelper from '../codeceptjs/console-recorder.helper.js';
import createSingleSessionHelper from '../codeceptjs/single-session.helper.js';
import pause from '../codeceptjs/brk.js';

const cjsRequire = createRequire(import.meta.url);

const defaultOpts = {
  // verbose: true,
};

let TestProject = process.cwd();
// current instance
let instance;

export default new class CodeceptjsFactory {
  constructor(configFile = 'codecept.conf.js') {
    this.configFile = configFile;
  }

  async loadCodeceptJSHelpers() {
    debug('Loading helpers...');
    const { Helper } = await codeceptjsModules();

    const reporterHelper = createRealtimeReporterHelper(Helper);
    const networkHelper = createNetworkRecorderHelper(Helper);
    const consoleHelper = createConsoleRecorderHelper(Helper);
    const singleSessionHelper = createSingleSessionHelper(Helper);

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

    const { Codecept, container, config, Helper } = await codeceptjsModules();

    config.reset();
    
    // Load configuration — config.load() is async in CodeceptJS 4.x
    await config.load(this.getConfigFile());
    config.append(cfg);
    cfg = config.get();

    debug('Using CodeceptJS config', cfg);

    container.clear();
    // create runner
    const codecept = new Codecept(cfg, opts = Object.assign(opts, defaultOpts));

    // initialize codeceptjs in current TestProject
    // initGlobals is async in CodeceptJS 4.x
    await codecept.initGlobals(TestProject);

    // Backward compatibility: define codecept_helper global for old CJS helpers
    // that use `let Helper = codecept_helper;` (removed in CodeceptJS 4.x)
    global.codecept_helper = Helper;

    // create helpers, support files, mocha
    // container.create is async in CodeceptJS 4.x
    await container.create(cfg, opts);

    this.codeceptjsHelpersConfig = await this.loadCodeceptJSHelpers();
    container.append(this.codeceptjsHelpersConfig);

    debug('Running hooks...');
    await codecept.runHooks();

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
      modulePath = cjsRequire.resolve(filePath);
    } catch (err) {
      return;
    }
    if (cjsRequire.cache[modulePath]) {
      delete cjsRequire.cache[modulePath];
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

    return mocha.suite.suites;
  }

  cleanupSupportObject(supportName) {
    const { container, config } = this.getInstance();
    const includesConfig = config.get('include');
    if (!includesConfig[supportName]) return;
    const support = container.support();
    delete support[supportName];
  }

  async reloadConfig(configHooks = null) {
    const { config, container } = this.getInstance();
    config.reset();
    if (configHooks) await configHooks();
    await config.load(this.getConfigFile());

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

  async reloadConfigIfNecessary(filePath) {
    if (filePath === this.getConfigFile()) {
      await this.reloadConfig();
    }
  }

  reloadSupportObjectIfNecessary(filePath) {
    const { config } = this.getInstance();
    // if it is a support object => reinclude it
    Object.entries(config.get('include'))
      .filter(e => e[1] === path.join(this.getRootDir(), filePath))
      .forEach(e => this.cleanupSupportObject(e[0]));
  }

  getCodeceptjsConfig() {
    try {
      const { config } = this.getInstance();
      return config.get();
    } catch (error) {
      debug('Could not get codeceptjs config, returning default:', error.message);
      return {
        tests: './',
        timeout: 10000,
        output: './output',
        helpers: {}
      };
    }
  }
};
