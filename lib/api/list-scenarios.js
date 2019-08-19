const scenarioRepository = require('../model/scenario-repository');
const codeceptjsFactory = require('../model/codeceptjs-factory');
const { config } = codeceptjsFactory.getInstance();

module.exports = (req, res) => {
  const searchQuery = req.query.q;

  const features = scenarioRepository.getFeatures(searchQuery);

  res.send({
    name: config.get('name'),
    features: scenarioRepository.groupFeaturesByCapability(features),
  });
}
