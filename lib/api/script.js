// NOTE: This is a standalone script, not used by the API router.
// It relies on synchronous module execution which is incompatible with ESM.
// Preserved for backwards compatibility but should be migrated to async.
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

