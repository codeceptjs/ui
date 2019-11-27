const testRunRepository = require('../model/testrun-repository');
const snapshotStore = require('../model/snapshot-store');

module.exports = (req, res) => {
  const { id } = req.params;

  const saveId = encodeURIComponent(id);

  testRunRepository.saveTestRun(saveId, req.body);
  snapshotStore.saveWithTestRun(saveId);

  res.json({
    message: 'OK'
  });
};
