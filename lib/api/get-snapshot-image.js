const debug = require('debug')('codeceptjs:get-snapshot-image');
const snapshotStore = require('../model/snapshot-store');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { id } = req.params;

  if (!snapshotStore.exists(id)) {
    res.status(404).send(`A snapshot for this step (${id}) does not exist`);
    return;
  }
  if (!snapshotStore.hasSnapshot(id)) {
    res.status(404).send(`No snapshot for step id ${id}`);
    return;
  }

  if (!snapshotStore.get(id).screenshot) {
    res.status(404).send(`Screenshot file does not exists for ${id}`);
  }

  const screenshotFile = path.join(global.output_dir, snapshotStore.get(id).screenshot);

  if (!fs.existsSync(screenshotFile)) {
    res.status(404).send(`Screenshot file does not exists for ${id}`);
    return;
  }

  try {
    res.sendFile(screenshotFile);
  } catch (err) {
    debug(`Screenshot was not loaded by id ${id}`, err);
  }
};