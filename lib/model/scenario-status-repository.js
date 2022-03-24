const assert = require('assert');
const debug = require('debug')('codeceptjs:scenario-status-repository');
const fs = require('fs');
const path = require('path');
const mkdir = require('../utils/mkdir');

mkdir(path.join(global.output_dir, '.ui'));
const ScenarioStatusFile = path.join(global.output_dir, '.ui', 'scenario-status.json');

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

module.exports = {
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
