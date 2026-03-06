const { getUrl } = require('../config/url');
const { codeceptjsModules } = require('../codeceptjs/codeceptjs-imports');
const codeceptjsFactory = require('../model/codeceptjs-factory');

const WS_URL = getUrl('ws');
const TestProjectDir = process.cwd();


module.exports = async (req, res) => {
  const socket = require('socket.io-client')(WS_URL);
  const { event } = await codeceptjsModules();

  const { scenario } = req.params;
  const { codecept, container } = codeceptjsFactory.getInstance();

  const mocha = container.mocha();
  mocha.grep(scenario);

  process.chdir(TestProjectDir);

  event.dispatcher.once(event.all.result, () => {
    mocha.unloadFiles();
    mocha.suite.cleanReferences();
    mocha.suite.suites = [];
    socket.emit('codeceptjs.exit', process.exitCode);
  });

  codecept.run();

  res.status(200).send('OK');
};

