const openInEditor = require('../model/open-in-editor');

module.exports = (req, res) => {
  const {file} = req.params;

  openInEditor(file);

  res.json('OK');
};