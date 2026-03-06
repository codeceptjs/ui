import Debug from 'debug';
const debug = Debug('codeceptjs:run-scenario');
import wsEvents from '../model/ws-events.js';
import pause from '../codeceptjs/brk.js';
import { codeceptjsModules, importSubpath } from '../codeceptjs/codeceptjs-imports.js';
import codeceptjsFactory from '../model/codeceptjs-factory.js';

export default async (req, res) => {
  const { codecept, container } = codeceptjsFactory.getInstance();
  const { event } = await codeceptjsModules();
  const { createTest } = await importSubpath('codeceptjs/lib/mocha/test');
  const { createSuite } = await importSubpath('codeceptjs/lib/mocha/suite');

  const mocha = container.mocha();
  mocha.grep();
  mocha.files = [];
  mocha.suite.suites = [];
  
  // Use Function constructor instead of eval() for safer code execution
  // The code from the editor is expected to be a function body like:
  // "async ({I}) => { I.amOnPage('/'); }"
  // eslint-disable-next-line no-new-func
  const code = new Function('return ' + req.body.code)();
  const test = createTest('new test', code);
  test.uid = 'new-test';
  
  const suite = createSuite(mocha.suite, 'new test');

  let pauseEnabled = true;

  // Note: In CodeceptJS 4.x, the scenario setup/teardown methods may have changed
  // For now, we'll keep the basic structure and let the framework handle setup
  
  suite.addTest(test);
  suite.appendOnlyTest(test);

  event.dispatcher.once(event.test.after, () => {
    if (pauseEnabled) pause();
  });

  event.dispatcher.once(event.all.result, () => {
    pauseEnabled = false;
    debug('testrun finished');
    try {
      codeceptjsFactory.reloadSuites();
    } catch (err) {
      debug('ERROR resetting suites', err);
    }
    wsEvents.codeceptjs.exit(0);
    mocha.suite.suites = [];
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
