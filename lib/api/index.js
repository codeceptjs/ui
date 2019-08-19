const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const getSnapshotHtml = require('./get-snapshot-html');
const getSnapshotImage = require('./get-snapshot-image');
const listScenarios = require('./list-scenarios');
const getScenario = require('./get-scenario');
const runScenario = require('./run-scenario');
const openTestInEditor = require('./open-test-in-editor');
const saveTestRun = require('./save-testrun');
const getTestRun = require('./get-testrun');

const jsonParser = bodyParser.json({ limit: '50mb' })

router.get('/snapshots/html/:id', getSnapshotHtml);
router.get('/snapshots/screenshot/:id', getSnapshotImage);

router.get('/scenarios', listScenarios);
router.get('/scenarios/:id', getScenario);
router.get('/scenarios/:scenario/run', runScenario);
router.get('/tests/:file/open', openTestInEditor);

router.get('/testruns/:id', getTestRun);
router.put('/testruns/:id', jsonParser, saveTestRun);

module.exports = router;
