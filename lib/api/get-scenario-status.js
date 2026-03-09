import Debug from 'debug';
const debug = Debug('codeceptjs:get-scenario-status');
import scenarioStatusRepository from '../model/scenario-status-repository.js';

export default (req, res) => {
  const status = scenarioStatusRepository.getStatus();
  debug(`Initial status is ${JSON.stringify(status)}`);

  res.json(status);
};
