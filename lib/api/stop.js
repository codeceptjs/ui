import Debug from 'debug';
const debug = Debug('codeceptjs:stop-scenario');
import wsEvents from '../model/ws-events.js';
import { codeceptjsModules } from '../codeceptjs/codeceptjs-imports.js';

export default async (req, res) => {
  debug('Stopping test execution');
  const { event } = await codeceptjsModules();

  try {
    if (global.runner) {
      debug('Aborting active runner');
      global.runner.abort();
      
      // Set a timeout to ensure we don't wait forever
      const timeout = setTimeout(() => {
        debug('Stop timeout reached, forcing exit event');
        wsEvents.codeceptjs.exit(-1);
        global.runner = null;
      }, 5000); // 5 second timeout
      
      // Ensure we properly signal test completion and reset running state
      event.dispatcher.once(event.all.result, () => {
        clearTimeout(timeout);
        if (global.runner) {
          global.runner._abort = false;
        }
        global.runner = null;
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
  } catch (error) {
    debug('Error stopping test execution:', error);
    // Always emit exit event to reset state even if there's an error
    wsEvents.codeceptjs.exit(-1);
    return res.status(500).send('Failed to stop execution');
  }
};
