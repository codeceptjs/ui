const express = require('express');
const router = express.Router();

const getSnapshotHtml = require('./get-snapshot-html');
const getSnapshotImage = require('./get-snapshot-image');
const listScenarios = require('./list-scenarios');
const runScenario = require('./run-scenario');
const runScenarioIPS = require('./run-scenario-in-process');
const openTestInEditor = require('./open-test-in-editor');

router.get('/snapshots/html/:id', getSnapshotHtml);
router.get('/snapshots/screenshot/:id', getSnapshotImage);
router.get('/scenarios', listScenarios);
router.get('/scenarios/:scenario/run', runScenario);
router.get('/scenarios/:scenario/run-ips', runScenarioIPS);
router.get('/tests/:file/open', openTestInEditor);

module.exports = router;
