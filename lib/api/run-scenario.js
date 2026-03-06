import Debug from 'debug';
const debug = Debug('codeceptjs:run-scenario');
import wsEvents from '../model/ws-events.js';
import { codeceptjsModules } from '../codeceptjs/codeceptjs-imports.js';
import codeceptjsFactory from '../model/codeceptjs-factory.js';

export default async (req, res) => {
  let { id, grep } = req.params;
  const { codecept, container } = codeceptjsFactory.getInstance();
  const { event } = await codeceptjsModules();

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
    wsEvents.codeceptjs.started({ timestamp: new Date().toISOString() });
    global.runner = mocha.run(done);
  } catch (e) {
    throw new Error(e);
  }

  return res.status(200).send('OK');
};
