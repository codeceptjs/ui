import testRunRepository from '../model/testrun-repository.js';
import snapshotStore from '../model/snapshot-store/index.js';

export default (req, res) => {
  const { id } = req.params;

  const saveId = encodeURIComponent(id);

  testRunRepository.saveTestRun(saveId, req.body);
  snapshotStore.saveWithTestRun(saveId);

  res.json({
    message: 'OK'
  });
};
