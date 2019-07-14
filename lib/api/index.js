const express = require('express');
const router = express.Router();

const getSnapshot = require('./get-snapshot');
const listScenarios = require('./list-scenarios');

router.get('/snapshots/html/:id', getSnapshot);
router.get('/scenarios', listScenarios);

module.exports = router;
