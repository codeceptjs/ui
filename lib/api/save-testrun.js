module.exports = (req, res) => {
  const { id } = req.params;

  console.log(req.body);

  res.json({
    message: 'OK'
  });
}
