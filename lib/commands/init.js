const commander = require('commander');
const fs = require('fs');
const path = require('path');

const codeceptjsFactory = require('../model/codeceptjs-factory');
const { setPort } = require('../config/env');
const portValidator = require('../utils/port-validator');

module.exports = () => {
  const program = new commander.Command();
  program.allowUnknownOption();
  program.version(JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8')).version);
  program
    .option('--app', 'launch Electron application')
    .option('--port <port>', 'Port for http:// connection', portValidator)
    .option('--wsPort <port>', 'Port for ws:// connection', portValidator)
    // codecept-only options
    .option('--steps', 'show step-by-step execution')
    .option('--debug', 'output additional information')
    .option('--verbose', 'output internal logging information')
    .option('-o, --override [value]', 'override current config options')
    .option('-c, --config [file]', 'configuration file to be used')
    .option('--features', 'run only *.feature files and skip tests')
    .option('--tests', 'run only JS test files and skip features')
    .option('-p, --plugins <k=v,k2=v2,...>', 'enable plugins, comma-separated');

  program.parse(process.argv);

  if (program.config) {
    const configFile = program.config;
    let configPath = configFile;
    if (!path.isAbsolute(configPath)) {
      configPath = path.join(process.cwd(), configFile);
    }
    if (!fs.lstatSync(configPath).isDirectory()) {
      codeceptjsFactory.setConfigFile(path.basename(configPath));
      configPath = path.dirname(configPath);
    }
    process.chdir(configPath);
    codeceptjsFactory.setRootDir(configPath);
  }

  const options = program.opts();

  setPort('application', options.port);
  setPort('ws', options.wsPort);

  if (program.app) {
    // open electron app
    global.isElectron = true;
    require('./electron');
  }

  codeceptjsFactory.create({}, options);

  return options;
};

