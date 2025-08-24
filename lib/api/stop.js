const debug = require('debug')('codeceptjs:stop-scenario');
const wsEvents = require('../model/ws-events');
const { event } = require('codeceptjs');

module.exports = async (req, res) => {
  debug('Stopping test execution');

  if (global.runner) {
    global.runner.abort();
    
    // Ensure we properly signal test completion and reset running state
    event.dispatcher.once(event.all.result, () => {
      global.runner._abort = false;
      debug('Test runner stopped and reset');
      // Emit exit event to reset frontend running state
      wsEvents.codeceptjs.exit(-1); // -1 indicates stopped by user
    });
  } else {
    // If no runner is active, still emit exit event to reset frontend state
    debug('No active runner found, resetting state');
    wsEvents.codeceptjs.exit(-1);
  }

  return res.status(200).send('OK');
};
