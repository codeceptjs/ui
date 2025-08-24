const debug = require('debug')('codeceptjs:run-scenario');
const wsEvents = require('../model/ws-events');
const pause = require('../codeceptjs/brk');
const { event } = require('codeceptjs');
const { createTest } = require('codeceptjs/lib/mocha/test');
const { createSuite } = require('codeceptjs/lib/mocha/suite');
const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = async (req, res) => {
  const { codecept, container } = codeceptjsFactory.getInstance();

  const mocha = container.mocha();
  mocha.grep();
  mocha.files = [];
  mocha.suite.suites = [];
  
  const code = eval(req.body.code);
  const test = createTest('new test', code);
  test.uid = 'new-test';
  
  const suite = createSuite(mocha.suite, 'new test');

  let pauseEnabled = true;

  // Note: In CodeceptJS 3.x, the scenario setup/teardown methods may have changed
  // For now, we'll keep the basic structure and let the framework handle setup
  
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
