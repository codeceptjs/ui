const debug = require('debug')('codepress:run-scenario-in-process');
const wsEvents = require('../model/ws-events');
const { event } = require('codeceptjs');
const codeceptjsFactory = require('../model/codeceptjs-factory');

// const TestProjectDir = process.cwd();

module.exports = async (req, res) => {
  const { id } = req.params;
  const { codecept, container } = codeceptjsFactory.getInstance();

  debug(`mocha.grep(${id})`)
  const mocha = container.mocha();
  mocha.grep(id);

  debug('codecept.runBootstrap()')
  codecept.runBootstrap();  

  event.dispatcher.once(event.all.result, () => {
    debug('testrun finished');
    codeceptjsFactory.resetSuites();
    wsEvents.codeceptjs.exit(0);
  });

  debug('codecept.run()')
  codecept.run();

  return res.status(200).send('OK');
}
