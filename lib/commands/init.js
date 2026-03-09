import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import codeceptjsFactory from '../model/codeceptjs-factory.js';
import { setPort } from '../config/env.js';
import portValidator from '../utils/port-validator.js';

export default () => {
  const program = new Command();
  program.allowUnknownOption();
  program.version(JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '..', '..', 'package.json'), 'utf8')).version);
  program
    .option('--app', 'launch Electron application')
    .option('--port <port>', 'Port for http:// connection', portValidator)
    .option('--wsPort <port>', 'Port for ws:// connection', portValidator)
    .option('--steps', 'show step-by-step execution')
    .option('--debug', 'output additional information')
    .option('--verbose', 'output internal logging information')
    .option('-o, --override [value]', 'override current config options')
    .option('-c, --config [file]', 'configuration file to be used')
    .option('--features', 'run only *.feature files and skip tests')
    .option('--tests', 'run only JS test files and skip features')
    .option('-p, --plugins <k=v,k2=v2,...>', 'enable plugins, comma-separated');

  program.parse(process.argv);

  const options = program.opts();

  if (options.config) {
    const configFile = options.config;
    let configPath = configFile;
    if (!path.isAbsolute(configPath)) {
      configPath = path.join(process.cwd(), configFile);
    }
    try {
      if (!fs.lstatSync(configPath).isDirectory()) {
        codeceptjsFactory.setConfigFile(path.basename(configPath));
        configPath = path.dirname(configPath);
      }
    } catch (err) {
      console.error(`Config path not found: ${configPath}`);
      process.exit(1);
    }
    process.chdir(configPath);
    codeceptjsFactory.setRootDir(configPath);
  }

  options.port = setPort('application', options.port);
  options.wsPort = setPort('ws', options.wsPort);

  return options;
};

