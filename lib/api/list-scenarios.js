import scenarioRepository from '../model/scenario-repository.js';
import codeceptjsFactory from '../model/codeceptjs-factory.js';

export default (req, res) => {
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
