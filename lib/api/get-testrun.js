const testRunRepository = require('../model/testrun-repository');
const snapshotStore = require('../model/snapshot-store');

module.exports = (req, res) => {
  const { id } = req.params;

  const saveId = encodeURIComponent(id);

  const testRun = testRunRepository.getTestRun(saveId);
  if (!testRun) return res.status(404).json({
    message: `No testrun with id ${saveId}`,
  });
  
  snapshotStore.restoreFromTestRun(saveId);

  res.json(testRun);
};