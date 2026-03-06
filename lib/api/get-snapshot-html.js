import Debug from 'debug';
const debug = Debug('codeceptjs:get-snapshot-html');
import snapshotStore from '../model/snapshot-store/index.js';

export default (req, res) => {
  const { id } = req.params;

  if (!snapshotStore.exists(id)) {
    debug(`step ${id} does not exist`);
    res.status(404).send(`A snapshot for this step (${id}) does not exist`);
    return;
  }
  if (!snapshotStore.hasSnapshot(id)) {
    debug(`step ${id} does not have a snapshot`);
    res.status(404).send(`No snapshot for step id ${id}`);
    return;
  }

  const source = snapshotStore.get(id).source;

  res.send(source);
};