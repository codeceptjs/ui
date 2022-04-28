const debug = require('debug')('codeceptjs:run-scenario');
const { event } = require('codeceptjs');

module.exports = async (req, res) => {

  if (global.runner) {
    global.runner.abort();
    event.dispatcher.once(event.all.result, () => {
      global.runner._abort = false;
    });
  }

  debug('codecept.run()');
  // codecept.run();

  return res.status(200).send('OK');
};
