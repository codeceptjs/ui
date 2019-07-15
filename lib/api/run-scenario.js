const util = require('util');
const exec = util.promisify(require('child_process').exec);

const TestProject = process.cwd();

// const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = async (req, res) => {
  const {scenario} = req.params;

  process.chdir(TestProject);
  exec(`npx codeceptjs run --steps --override "{ \\"helpers\\": {\\"RealtimeReporterHelper\\": {\\"require\\": \\"./_codepress/realtime-reporter.helper.js\\"}}}" --grep "${scenario}"`)

  // const {container} = codeceptjsFactory.createRunner();
  // container.mocha().

  res.status(200).send('OK');
}