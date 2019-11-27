const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const getSnapshotHtml = require('./get-snapshot-html');
const getSnapshotImage = require('./get-snapshot-image');
const listActions = require('./list-actions');
const listScenarios = require('./list-scenarios');
const getScenario = require('./get-scenario');
const runScenario = require('./run-scenario');
const runNew = require('./new-test');
const stopScenario = require('./stop');
const runScenarioParallel = require('./run-scenario-parallel');
const openTestInEditor = require('./open-test-in-editor');
const saveTestRun = require('./save-testrun');
const getTestRun = require('./get-testrun');
// const listProfiles = require('./list-profiles');
const getSettings = require('./get-settings');
const getConfig = require('./get-config');
const storeSettings = require('./store-settings');
const getScenarioStatus = require('./get-scenario-status');

const jsonParser = bodyParser.json({ limit: '50mb' });

router.get('/snapshots/html/:id', getSnapshotHtml);
router.get('/snapshots/screenshot/:id', getSnapshotImage);

router.get('/scenario-status', getScenarioStatus);

router.get('/scenarios', listScenarios);
router.get('/actions', listActions);
router.get('/scenarios/:id', getScenario);

router.post('/scenarios/run', jsonParser, runScenario);
router.post('/scenarios/grep/:grep/run', jsonParser, runScenario);
router.post('/scenarios/:id/run', jsonParser, runScenario);
router.post('/scenarios/stop', jsonParser, stopScenario);
router.post('/run-new', jsonParser, runNew);
router.post('/scenarios/:grep/run-parallel', jsonParser, runScenarioParallel);
router.get('/tests/:file/open', openTestInEditor);

router.get('/testruns/:id', getTestRun);
router.put('/testruns/:id', jsonParser, saveTestRun);

router.get('/config', getConfig);
router.get('/settings', getSettings);
router.put('/settings', jsonParser, storeSettings);
// router.get('/profiles', listProfiles);

module.exports = router;
