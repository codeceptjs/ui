const express = require('express');
const router = express.Router();

const getSnapshot = require('./get-snapshot');
const listScenarios = require('./list-scenarios');
const runScenario = require('./run-scenario');

router.get('/snapshots/html/:id', getSnapshot);
router.get('/scenarios', listScenarios);
router.get('/scenarios/:scenario/run', runScenario);

module.exports = router;
