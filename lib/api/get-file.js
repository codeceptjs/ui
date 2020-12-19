const fs = require('fs').promises;

module.exports = (req, res) => {
  if (!req.file) return;
  if (!req.file.startsWith(global.codecept_dir)) return; // not a codecept file
  res.send(fs.readFileSync(req.file));
};
