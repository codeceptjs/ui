const debug = require('debug')('codeceptjs:run-scenario');
const wsEvents = require('../model/ws-events');
const pause = require('../codeceptjs/brk');
const { event } = require('codeceptjs');
const Test = require('mocha/lib/test');
const Suite = require('mocha/lib/suite');
const scenario = require('codeceptjs/lib/scenario');
const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = async (req, res) => {
  const { codecept, container } = codeceptjsFactory.getInstance();

  const mocha = container.mocha();
  mocha.grep();
  mocha.files = [];
  mocha.suite.suites = [];
  
  const code = eval(req.body.code);
  const test = scenario.test(new Test('new test', code));
  test.uid = 'new-test';
  
  const suite = Suite.create(mocha.suite, 'new test');

  let pauseEnabled = true;

  suite.beforeEach('codeceptjs.before', () => scenario.setup(suite));
  suite.afterEach('finalize codeceptjs', () => scenario.teardown(suite));

  suite.beforeAll('codeceptjs.beforeSuite', () => scenario.suiteSetup(suite));
  suite.afterAll('codeceptjs.afterSuite', () => scenario.suiteTeardown(suite));


  suite.addTest(test);
  suite.appendOnlyTest(test);

  event.dispatcher.once(event.test.after, () => {
    if (pauseEnabled) pause();
  });

  event.dispatcher.once(event.all.result, () => {
    pauseEnabled = false;
    debug('testrun finished');
    try {
      codeceptjsFactory.reloadSuites();
    } catch (err) {
      debug('ERROR resetting suites', err);
    }
    wsEvents.codeceptjs.exit(0);
    mocha.suite.suites = [];
  });

  debug('codecept.run()');
  const done = () => {
    event.emit(event.all.result, codecept);
    event.emit(event.all.after, codecept);
  };

  try {
    event.emit(event.all.before, codecept);
    global.runner = mocha.run(done);
  } catch (e) {
    throw new Error(e);
  }

  return res.status(200).send('OK');
};
