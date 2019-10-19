const debug = require('debug')('codepress:run-scenario');
const wsEvents = require('../model/ws-events');
const { event } = require('codeceptjs');
const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = async (req, res) => {
  const { id } = req.params;
  const { codecept, container } = codeceptjsFactory.getInstance();

  debug(`mocha.grep(${id})`)
  const mocha = container.mocha();

  mocha.suite.suites = [];
  mocha.grep(id);
  
  debug('codecept.runBootstrap()')
  codecept.runBootstrap();  

  event.dispatcher.once(event.all.result, () => {
    debug('testrun finished');
    try {
      codeceptjsFactory.resetSuites();
    } catch (err) {
      debug('ERROR resetting suites', err);
    }
    wsEvents.codeceptjs.exit(0);
  });


  debug('codecept.run()')
  codecept.run();

  return res.status(200).send('OK');
}
