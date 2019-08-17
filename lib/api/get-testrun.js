const testRunRepository = require('../model/testrun-repository');

module.exports = (req, res) => {
  const { id } = req.params;

  const testRun = testRunRepository.getTestRun(id);
  if (!testRun) return res.status(404).json({
    message: `No testrun with id ${id}`,
  });
  
  res.json(testRun);
}