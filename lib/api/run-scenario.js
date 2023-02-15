const debug = require('debug')('codeceptjs:run-scenario');
const wsEvents = require('../model/ws-events');
const { event } = require('codeceptjs');
const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = async (req, res) => {
  let { id, grep } = req.params;
  const { codecept, container } = codeceptjsFactory.getInstance();

  const mocha = container.mocha();
  mocha.grep(); // disable current grep
  
  if (id) {
    mocha.suite.eachTest(test => {
      if (test.uid === decodeURIComponent(id)) {
        test.parent.appendOnlyTest(test);
      }
    });
    
    event.dispatcher.once(event.suite.before, suite => {
      suite._onlyTests = [];
    });  
  }

  if (grep) {
    mocha.fgrep(grep);
  }

  event.dispatcher.once(event.all.result, () => {
    mocha.grep(); // disable grep
    debug('testrun finished');
    try {
      codeceptjsFactory.reloadSuites();
    } catch (err) {
      debug('ERROR resetting suites', err);
    }
    wsEvents.codeceptjs.exit(0);
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
