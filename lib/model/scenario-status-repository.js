import assert from 'assert';
import Debug from 'debug';
const debug = Debug('codeceptjs:scenario-status-repository');
import fs from 'fs';
import path from 'path';
import mkdir from '../utils/mkdir.js';

const _outputDir = global.output_dir || process.cwd();
mkdir(path.join(_outputDir, '.ui'));
const ScenarioStatusFile = path.join(_outputDir, '.ui', 'scenario-status.json');

const ScenarioStatus = ['passed', 'failed'];

let scenarioStatus = {};

const saveStatus = () => {
  fs.writeFileSync(ScenarioStatusFile, JSON.stringify(scenarioStatus), 'utf8');
};

const restoreStatus = () => {
  if (!fs.existsSync(ScenarioStatusFile)) return;

  const scenarioStatusAsString = fs.readFileSync(ScenarioStatusFile);
  scenarioStatus = JSON.parse(scenarioStatusAsString);
  return scenarioStatus;
};

restoreStatus();

export default {
  setStatus(scenarioId, status) {
    assert(scenarioId, 'scenarioId is required');

    if (!ScenarioStatus.includes(status.status)) {
      throw new Error(`status must be one of ${ScenarioStatus}`);
    }
    debug(`Setting scenario status of ${scenarioId} to ${status}`);
    scenarioStatus[scenarioId] = status;
    return scenarioStatus;
  },
  getStatus() {
    return scenarioStatus;
  },
  saveStatus,
  restoreStatus,
};

process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('Saving status...');
  saveStatus();  
  process.exit();  
});
