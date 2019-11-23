const debug = require('debug')('codepress:run-scenario');
const wsEvents = require('../model/ws-events');
const { event } = require('codeceptjs');
const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = async (req, res) => {
  let { id } = req.params;
  const { codecept, container } = codeceptjsFactory.getInstance();

  const mocha = container.mocha();

  // mocha.suite.eactTest(t => {
    //   t.id === id || t.pending = true);
    // console.log(id, mocha.suite.suites.map(s => s.tests));
    
    debug('codecept.runBootstrap()')
    codecept.runBootstrap();  

    // only hides all other tests

  // id = id;

  // mocha.grep(id);
  // console.log('grepping', id);

  mocha.suite.eachTest(test => {
    if (test.id === decodeURIComponent(id)) {
      test.parent.appendOnlyTest(test);
    }
  });
  event.dispatcher.once(event.suite.before, suite => {
    suite._onlyTests = [];
  });


  event.dispatcher.once(event.all.result, () => {
    debug('testrun finished');
    try {
      codeceptjsFactory.reloadSuites();
    } catch (err) {
      debug('ERROR resetting suites', err);
    }
    wsEvents.codeceptjs.exit(0);
  });

  debug('codecept.run()')
  codecept.run();

  return res.status(200).send('OK');
}
