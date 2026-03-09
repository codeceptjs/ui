// @deprecated This standalone script is not used by the API router.
// It was used for manual test execution but is now superseded by
// the run-scenario API endpoint. Consider removing in a future version.
import codeceptjsFactory from '../model/codeceptjs-factory.js';
import { codeceptjsModules } from '../codeceptjs/codeceptjs-imports.js';

async function run() {
  const { event } = await codeceptjsModules();
  
  const { codecept, container } = codeceptjsFactory.getInstance({}, {
    grep: 'Create a new todo item'
  });

  const mocha = container.mocha();
  mocha.grep('Create a new todo item');

  // run bootstrap function from config
  await codecept.runBootstrap();  

  codecept.run();

  event.dispatcher.once(event.all.result, () => {
    mocha.unloadFiles();  
    mocha.suite.cleanReferences();
    mocha.suite.suites = [];
    codecept.run();
  });
}

run().catch(console.error);

