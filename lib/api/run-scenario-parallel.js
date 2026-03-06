import os from 'os';
import Debug from 'debug';
const debug = Debug('codeceptjs:run-scenario-multiple');
import wsEvents from '../model/ws-events.js';
import { codeceptjsModules } from '../codeceptjs/codeceptjs-imports.js';
import codeceptjsFactory from '../model/codeceptjs-factory.js';
import runWithWorkers from '../model/codeceptjs-run-workers/index.js';

export default async (req, res) => {
  const { grep } = req.params;
  const numberOfWorkers = os.cpus().length;
  const { event } = await codeceptjsModules();

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
