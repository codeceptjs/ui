import Vue from 'vue';
import axios from 'axios';
import uuid from 'uuid/v4';

const getTestById = (tests, id) => tests.filter(t => t.id === id)[0]; // TODO Use testId to find test
const getCurrentTest = state => state.tests[state.tests.length - 1];
const addMetaStepToCurrentTest = (state, metaStep) => {
  if (metaStep.metaStep) addMetaStepToCurrentTest(state, metaStep.metaStep);
  if (metaStep.actor === 'Test:') return false;
  getCurrentTest(state).steps.push({
    type: 'meta',
    result: 'passed',
    ...metaStep
  });
};

const testRuns = {
  namespaced: true,
  state: {
    isRunning: undefined,
    lastSnapshot: undefined,
    // TODO Use testIds and support multiple testruns in parallel
    tests: [],
    log: [],
  },
  mutations: {
    clearTests: (state) => {
      state.isRunning = false;
      state.tests = [];
    },
    addTest: (state, test) => {
      Vue.set(test, 'steps', []);
      Vue.set(test, 'result', 'running');
      Vue.set(state, 'tests', [...state.tests, test]);
    },
    addStepToCurrentTest: (state, step) => {
      const currentTest = getTestById(state.tests, step.testId);
      if (step.snapshot) {
        state.lastSnapshot = step.snapshot;
      } else {
        Vue.set(step, 'snapshot', state.lastSnapshot);
      }
      Vue.set(step, 'result', 'passed');
      currentTest.steps.push(step);
    },
    addMetaStepToCurrentTest,
    addCommentToCurrentTest: (state, comment) => {
      const currentTest = getCurrentTest(state);
      currentTest.steps.push({
        type: 'comment',
        result: 'passed',
        ...comment
      });
    },
    updateStep: (state, step) => {
      const test = getTestById(state.tests, step.testId);
      const currentStep = test.steps[test.steps.length - 1];
      Vue.set(currentStep, 'returnValue', step.returnValue);
    },
    markAsFailedCurrentTest: (state, data) => {
      const currentTest = state.tests[state.tests.length - 1];
      const currentStep = currentTest.steps[currentTest.steps.length - 1];

      currentTest.result = 'failed';
      Vue.set(currentTest, 'error', data.error);
      Vue.set(currentTest, 'duration', data.duration);

      Vue.set(currentStep, 'result', 'failed');
      if (data.snapshot) {
        Vue.set(currentStep, 'snapshot', data.snapshot);
      }
    },
    markAsPassedCurrentTest: (state, data) => {
      const currentTest = state.tests[state.tests.length - 1];
      const currentStep = currentTest.steps[currentTest.steps.length - 1];

      Vue.set(currentTest, 'duration', data.duration);
      currentTest.result = 'passed';
      if (data.snapshot) {
        Vue.set(currentStep, 'snapshot', data.snapshot);
      }
    },
    setRunning: (state, isRunning) => {
      state.isRunning = isRunning;
    },
    addedLog: (state, entityOfLog) => {
      return state.log = state.log.concat(entityOfLog);
    }
  },
  getters: {
    testRuns: state => {
      return state.tests;
    },
    isRunning: state => {
      return state.isRunning;
    },
    currentTest: state => {
      return getCurrentTest(state);
    },
    errorTypeCounter: state => (type = 'log') => {
      return state.log.filter(item => item.type === type).filter(Boolean).length || 0;
    },
    logsList: state => state.log,
  },
  actions: {
    saveTestRun: async function (context, testRun) {
      return axios.put(`/api/testruns/${encodeURIComponent(testRun.id)}`, testRun);
    },

    loadTestRun: async ({ state }, id) => {
      try {
        const resp = await axios.get(`/api/testruns/${encodeURIComponent(id)}`);
        state.tests = [resp.data];
      } catch (err) {
        state.tests = []; // reset if no cached testrun results available
      }
    },

    runNewTest: async function ({ commit }, code) {
      axios.post('/api/run-new', { code });
      
      commit('clearTests');
      commit('setRunning', true);
    },

    runScenario: async function ({ commit }, { id, profileName }) {
      if (!id) throw new Error('id is required');
      axios.post(`/api/scenarios/${encodeURIComponent(id)}/run`, { profileName });
      commit('clearTests');
      commit('setRunning', true);
    },

    runAll: async function ({ commit }) {
      await axios.post('/api/scenarios/run', {});
      commit('clearTests');
      commit('setRunning', true);
    },

    stop: async function () {
      await axios.post('/api/scenarios/stop', {});
    },

    runGrep: async function ({ commit }, grep) {
      grep = grep.trim();
      await axios.post(`/api/scenarios/grep/${encodeURIComponent(grep)}/run`, {});
      commit('clearTests');
      commit('setRunning', true);
    },

    'SOCKET_codeceptjs.started': function ({ commit }) {
      commit('clearTests');
      commit('setRunning', true);
    },
    'SOCKET_codeceptjs.exit': function ({ commit }) {
      commit('setRunning', false);
    },
    'SOCKET_suite.before': function () {
    },
    'SOCKET_test.before': function ({ commit }, test) {
      commit('addTest', test);
    },
    'SOCKET_test.after': function ({ dispatch, state }) {
      const currentTest = state.tests[state.tests.length - 1];
      dispatch('saveTestRun', currentTest);
    },
    'SOCKET_test.failed': function ({ commit }, error) {
      commit('markAsFailedCurrentTest', error);
    },
    'SOCKET_test.passed': function ({ commit }, data) {
      commit('markAsPassedCurrentTest', data);
    },
    'SOCKET_console.log': function ({ commit }, logEntry) { // eslint-disable-line no-unused-vars
      if (!logEntry.type) return;
      const { type, url, lineno: lineNumber, args: message } = logEntry;
      commit('addedLog', {
        type,
        message,
        lineNumber,
        url,
        id: uuid(),
      });
      console[type]('Test >', message); // eslint-disable-line no-console
    },
    'SOCKET_step.comment': function ({ commit }, comment) {
      commit('addCommentToCurrentTest', comment);
    },
    'SOCKET_step.before': function ({ commit }, step) {
      commit('addStepToCurrentTest', step);
    },
    'SOCKET_step.passed': function ({commit}, step) {
      commit('updateStep', step);
    },
    'SOCKET_metastep.changed': function (context, metastep) {
      context.commit('addMetaStepToCurrentTest', metastep);
    }
  }
};

export default testRuns;
