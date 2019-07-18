const debug = require('debug')('codepress:run-scenario');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const TestProjectDir = process.cwd();

function escapeDoubleQuotes(str) {
	return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
}

module.exports = async (req, res) => {
  const {scenario} = req.params;

  // TODO Make that work for all helpers not only puppeteer
  const configOverrides = { 
    helpers: {
      Puppeteer: {
        disableScreenshots: true,
      },
      RealtimeReporterHelper: {
        require: './_codepress/realtime-reporter.helper.js',
      }
    }
  };

  const codeceptjsCommand = `npx codeceptjs run --steps --override "${escapeDoubleQuotes(JSON.stringify(configOverrides))}" --grep "${escapeDoubleQuotes(scenario)}"`;
  debug(`Executing ${codeceptjsCommand}`);

  process.chdir(TestProjectDir);
  exec(codeceptjsCommand);

  res.status(200).send('OK');
}