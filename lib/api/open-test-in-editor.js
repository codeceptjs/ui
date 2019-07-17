const openEditor = require('open-editor');

module.exports = (req, res) => {
  const {file} = req.params;

  openEditor([file]);

  res.json('OK');
}