const openInEditor = require('../model/open-in-editor');


module.exports = async (req, res) => {
  const { file } = req.params;
  try {
    await openInEditor(file);
    res.json('OK');
  } catch (e) {
    res.status(422).send({ message: 'Editor can\'t be started', description: e.stderr.toString().trim() });
  }
};
