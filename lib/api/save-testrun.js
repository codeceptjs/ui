const testRunRepository = require('../model/testrun-repository');

module.exports = (req, res) => {
  const { id } = req.params;

  testRunRepository.saveTestRun(id, req.body);

  res.json({
    message: 'OK'
  });
}
