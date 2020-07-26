const scenarioRepository = require('../model/scenario-repository');
const codeceptjsFactory = require('../model/codeceptjs-factory');

module.exports = (req, res) => {
  const { config } = codeceptjsFactory.getInstance();
  const searchQuery = req.query.q;
  const matchType = req.query.m || 'all';

  scenarioRepository.reloadSuites();
  const features = scenarioRepository.getFeatures(searchQuery, { matchType });

  res.send({
    name: config.get('name'),
    features: scenarioRepository.groupFeaturesByCapability(features),
  });
};
