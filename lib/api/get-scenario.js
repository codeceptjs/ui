const scenarioRepository = require('../model/scenario-repository');

module.exports = (req, res) => {
  const { id } = req.params;

  const scenario = scenarioRepository.getScenario(id);
  if (!scenario) {
    return res.status(404).json({
      message: `Could not find scenario ${id}`,
    });
  }
  res.json(scenario);
};
