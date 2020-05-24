import Vue from 'vue';
import axios from 'axios';

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
  },
  mutations: {
    clearTests: (state) => {
      Vue.set(state, 'isRunning', false);
      Vue.set(state, 'tests', []);
    },
    addTest: (state, test) => {
      Vue.set(test, 'steps', []);
      Vue.set(test, 'result', 'running');
      Vue.set(state, 'tests', [...state.tests, test]);
    },
    addStepToCurrentTest: (state, step) => {
      if (!step) return;
      const currentTest = getTestById(state.tests, step.testId);
      const currentStepIndex = currentTest.steps.findIndex(s => s.id === step.id);

      if (currentStepIndex === -1) {
        currentTest.steps.push(step);
        return;
      }
      const newStep = Object.assign(currentTest.steps[currentStepIndex], step);
      Vue.set(currentTest.steps, currentStepIndex, newStep);      
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
    markAsFailedCurrentTest: (state, data) => {
      let currentTest = getTestById(state.tests, data.testId);
      if (!currentTest) {
        currentTest = data;
        state.tests.push(currentTest);
      }
      
      currentTest.result = 'failed';
      Vue.set(currentTest, 'error', data.error);
      Vue.set(currentTest, 'duration', data.duration);  
    },
    markAsPassedCurrentTest: (state, data) => {
      const currentTest = getTestById(state.tests, data.testId);
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
    }
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

    runScenario: async function ({ commit }, test) {
      if (!test.id) throw new Error('id is required');
      axios.post(`/api/scenarios/${encodeURIComponent(test.id)}/run`);
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
    'SOCKET_step.comment': function ({ commit }, comment) {
      commit('addCommentToCurrentTest', comment);
    },
    'SOCKET_step.before': function ({ commit }, step) {
      commit('addStepToCurrentTest', step);
    },
    'SOCKET_step.after': function ({ commit }, step) {
      commit('addStepToCurrentTest', step);
    },
    'SOCKET_metastep.changed': function (context, metastep) {
      context.commit('addMetaStepToCurrentTest', metastep);
    }
  }
};

export default testRuns;
