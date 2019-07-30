const path = require('path');
const debug = require('debug')('codepress:run-scenario');
const { event } = require('codeceptjs')
const codeceptjsFactory = require('../model/codeceptjs-factory');

const { spawn } = require('child_process')

const WS_URL = 'http://localhost:3000';
const TestProjectDir = process.cwd();

const escapeDoubleQuotes = (str) => {
	return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); 
}

const getConfig = (HelperName) => {
  if (HelperName === 'Puppeteer') {
    return { 
      helpers: {
        Puppeteer: {
          disableScreenshots: true,
  
          chrome: {
            // userDataDir: './_codepress/user-data' // TODO Speeds things up through caching, but also keeps cookies
          }
        },
        // RealtimeReporterHelper: {
        //   require: './_codepress/realtime-reporter.helper.js',
        // }
      }
    };
  }

  throw new Error(`Unknown helper ${HelperName}`);
}


module.exports = async (req, res) => {
  const socket = require('socket.io-client')(WS_URL);

  const configOverrides = getConfig('Puppeteer');
  const { scenario } = req.params;
  const { codecept, container, config } = codeceptjsFactory.getInstance();
  config.append(configOverrides);
  container.append({
    helpers: {
      RealtimeReporterHelper: require('../codeceptjs/realtime-reporter.helper')
    }
  });
  const mocha = container.mocha();
  mocha.grep(scenario);

  // initialize listeners
  codecept.runHooks();

  // run bootstrap function from config
  codecept.runBootstrap();  

  // process.chdir(TestProjectDir);

  event.dispatcher.once(event.all.result, () => {
    socket.emit('codeceptjs.exit', 0);
  });

  // console.log(codecept.testFiles);
  // console.log(container.mocha());

  codecept.run();

  res.status(200).send('OK');

  return;




  // TODO Make that work for all helpers not only puppeteer

  debug(`Spawing npx codeceptjs run --steps --override "${escapeDoubleQuotes(JSON.stringify(configOverrides))}" --grep "${escapeDoubleQuotes(scenario)}"`)

  // replace with 

  const codeceptjsProcess = spawn(path.join('.', 'node_modules', '.bin', 'codeceptjs'), [
      'run', '--steps', 
      '--override', `"${escapeDoubleQuotes(JSON.stringify(configOverrides))}"`,
      '--grep', `"${escapeDoubleQuotes(scenario)}"`
  ], { stdio: ['ignore', 'pipe', 'inherit'], shell: true }); // shell true is important for quoted params

  socket.emit('codeceptjs.started', {
    pid: codeceptjsProcess.pid,
  });

  codeceptjsProcess.on('error', err => {
    socket.emit('codeceptjs.error', err);
  });
  codeceptjsProcess.on('close', code => {
    socket.emit('codeceptjs.exit', code);
  });
  codeceptjsProcess.on('exit', code => {
    socket.emit('codeceptjs.exit', code);
  });
  codeceptjsProcess.stdout.on('data', data => {
    socket.emit('codeceptjs.stdout', data);
  })


}