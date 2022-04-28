const debug = require('debug')('codeceptjs:get-scenario-status');
const scenarioStatusRepository = require('../model/scenario-status-repository');

module.exports = (req, res) => {
  const status = scenarioStatusRepository.getStatus();
  debug(`Initial status is ${JSON.stringify(status)}`);

  res.json(status);
};
