import express from 'express';
import bodyParser from 'body-parser';
const router = express.Router();

import { getPort } from './../config/env.js';

import getSnapshotHtml from './get-snapshot-html.js';
import getSnapshotImage from './get-snapshot-image.js';
import listActions from './list-actions.js';
import listScenarios from './list-scenarios.js';
import getScenario from './get-scenario.js';
import getFile from './get-file.js';
import runScenario from './run-scenario.js';
import runNew from './new-test.js';
import stopScenario from './stop.js';
import runScenarioParallel from './run-scenario-parallel.js';
import openTestInEditor from './open-test-in-editor.js';
import saveTestRun from './save-testrun.js';
import getTestRun from './get-testrun.js';
// const listProfiles = require('./list-profiles');
import getSettings from './get-settings.js';
import getConfig from './get-config.js';
import storeSettings from './store-settings.js';
import getScenarioStatus from './get-scenario-status.js';
import getSteps from './get-steps.js';
import getPageObjects from './get-page-objects.js';
import * as editor from './editor.js';

const jsonParser = bodyParser.json({ limit: '50mb' });

router.get('/steps', getSteps);
router.get('/page-objects', getPageObjects);
router.get('/snapshots/html/:id', getSnapshotHtml);
router.get('/snapshots/screenshot/:id', getSnapshotImage);
router.post('/file', jsonParser, getFile);

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

// Code Editor API endpoints
router.get('/editor/scenario/:file/:line', editor.getScenarioSource);
router.put('/editor/scenario/:file/:line', jsonParser, editor.updateScenario);
router.get('/editor/file/:file', editor.getFileContent);
router.put('/editor/file/:file', jsonParser, editor.updateFileContent);
router.get('/editor/autocomplete', editor.getAutocompleteSuggestions);

router.get('/testruns/:id', getTestRun);
router.put('/testruns/:id', jsonParser, saveTestRun);

router.get('/config', getConfig);
router.get('/settings', getSettings);
router.put('/settings', jsonParser, storeSettings);
// router.get('/profiles', listProfiles);

router.get('/ports', (req, res) => {
  res.json({
    port: getPort('application'),
    wsPort: getPort('ws'),
  });
});

export default router;
