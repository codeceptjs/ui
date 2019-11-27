const { event } = require('codeceptjs');
const codeceptjsFactory = require('../model/codeceptjs-factory');

const { codecept, container } = codeceptjsFactory.getInstance({}, {
  grep: 'Create a new todo item'
});

const mocha = container.mocha();
mocha.grep('Create a new todo item');

// run bootstrap function from config
codecept.runBootstrap();  

// process.chdir(TestProjectDir);

codecept.run();

event.dispatcher.once(event.all.result, () => {
  mocha.unloadFiles();  
  mocha.suite.cleanReferences();
  mocha.suite.suites = [];
  codecept.run();
});

