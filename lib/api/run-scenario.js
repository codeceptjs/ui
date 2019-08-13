const path = require('path');
const debug = require('debug')('codepress:run-scenario');
const { spawn } = require('child_process')

const wsEvents = require('../model/ws-events');

const escapeDoubleQuotes = (str) => {
  return str
    .replace(/\\([\s\S])|(")/g,"\\$1$2")
    .replace('(', '\\(')
    .replace(')', '\\)'); 
}

const getConfig = (HelperName) => {
  if (HelperName === 'Puppeteer') {
    return { 
      helpers: {
        Puppeteer: {
          disableScreenshots: true,
          pressKeyDelay: 0,
  
          chrome: {
            // userDataDir: './_codepress/user-data' // TODO Speeds things up through caching, but also keeps cookies
          }
        },
        RealtimeReporterHelper: {
          require: './_codepress/realtime-reporter.helper.js',
        }
      }
    };
  }

  throw new Error(`Unknown helper ${HelperName}`);
}


module.exports = async (req, res) => {
  const { scenario } = req.params;

  const configOverrides = getConfig('Puppeteer');

  debug(`Spawing npx codeceptjs run --steps --override "${escapeDoubleQuotes(JSON.stringify(configOverrides))}" --grep "${escapeDoubleQuotes(scenario)}"`)

  const codeceptjsProcess = spawn(path.join('.', 'node_modules', '.bin', 'codeceptjs'), [
      'run', '--steps', 
      '--override', `"${escapeDoubleQuotes(JSON.stringify(configOverrides))}"`,
      '--grep', `"${escapeDoubleQuotes(scenario)}"`
  ], { stdio: ['ignore', 'pipe', 'inherit'], shell: true }); // shell true is important for quoted params

  wsEvents.codeceptjs.started({
    pid: codeceptjsProcess.pid,
  })

  codeceptjsProcess.on('error', err => {
    wsEvents.codeceptjs.error(err);
  });

  codeceptjsProcess.on('exit', code => {
    wsEvents.codeceptjs.exit(code);
  });

  res.status(200).send('OK');

  return;
}
