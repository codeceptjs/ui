import { getUrl } from '../config/url.js';
import { codeceptjsModules } from '../codeceptjs/codeceptjs-imports.js';
import codeceptjsFactory from '../model/codeceptjs-factory.js';

const WS_URL = getUrl('ws');
const TestProjectDir = process.cwd();


export default async (req, res) => {
  const { io } = await import('socket.io-client');
  const socket = io(WS_URL);
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

