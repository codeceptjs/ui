// @deprecated This standalone script is not used by the API router.
// It was used for manual test execution but is now superseded by
// the run-scenario API endpoint. Consider removing in a future version.
const codeceptjsFactory = require('../model/codeceptjs-factory');

async function run() {
  const { codeceptjsModules } = require('../codeceptjs/codeceptjs-imports');
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

