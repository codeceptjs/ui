const os = require('os');
const debug = require('debug')('codeceptjs:run-scenario-multiple');
const wsEvents = require('../model/ws-events');
const { event } = require('codeceptjs');
const codeceptjsFactory = require('../model/codeceptjs-factory');
const runWithWorkers = require('../model/codeceptjs-run-workers');

module.exports = async (req, res) => {
  const { grep } = req.params;
  const numberOfWorkers = os.cpus().length;

  const { config, codecept, container } = codeceptjsFactory.getInstance();

  event.dispatcher.once(event.all.after, () => {
    debug('testrun finished');
    try {
      codeceptjsFactory.resetSuites();
    } catch (err) {
      debug('ERROR resetting suites', err);
    }
    wsEvents.codeceptjs.exit(0);
  });

  debug('Running with workers...');
  runWithWorkers(numberOfWorkers, config.get(), { grep }, codecept, container);

  return res.status(200).send('OK');
};
