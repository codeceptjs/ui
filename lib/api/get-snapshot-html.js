const debug = require('debug')('codepress:snapshot-store')
const snapshotStore = require('../model/snapshot-store');

module.exports = (req, res) => {
  const {id} = req.params;

  if (!snapshotStore.exists(id)) {
    res.status(404).send(`No step for id ${id}`);
    return;
  }
  if (!snapshotStore.hasSnapshot(id)) {
    res.status(404).send(`No snapshot for step id ${id}`);
    return;
  }

  const source = snapshotStore.get(id).snapshot.source;

  debug(`Sending source for id ${id}`);
  res.send(source);
}