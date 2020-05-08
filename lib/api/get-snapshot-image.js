const snapshotStore = require('../model/snapshot-store');

module.exports = (req, res) => {
  const {id} = req.params;

  if (!snapshotStore.exists(id)) {
    res.status(404).send(`A snapshot for this step (${id}) does not exist`);
    return;
  }
  if (!snapshotStore.hasSnapshot(id)) {
    res.status(404).send(`No snapshot for step id ${id}`);
    return;
  }

  res.send(snapshotStore.get(id).snapshot.screenshot);
};