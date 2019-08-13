const debug = require('debug')('codepress:codeceptjs-factory');
const path = require('path');

// codepress must be run in testproject dir
const TestProject = process.cwd();

const container = require('codeceptjs').container;
const Codecept = require('codeceptjs').codecept;
const config = require('codeceptjs').config;

const defaultOpts = { };

// current instance
let instance;

const loadRealtimeReporter = container => {
  debug('Loading realtime helper...')
  const RealtimeReporterHelper = require('../codeceptjs/realtime-reporter.helper')
  const reporter = new RealtimeReporterHelper();
  reporter._init();

  container.append({
    helpers: {
      RealtimeReporterHelper: reporter
    }
  });
}


module.exports = new class CodeceptjsFactory {
  constructor() {}

  getInstance() {
    if (!instance) instance = this.create();
    return instance;
  }

  create(cfg = {}, opts = {}) {
    debug('Creating codeceptjs instance...');

    config.reset();
    config.load(path.join(TestProject, 'codecept.conf.js'))
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

    loadRealtimeReporter(container);

    // load tests
    debug('Loading tests...');
    codecept.loadTests(cfg.tests);
    
    debug('Running hooks...');
    codecept.runHooks();

    return {
      config,
      codecept,
      container,
    }
  }
};
