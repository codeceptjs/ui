import Vue from 'vue';
import axios from 'axios';

const getTestById = (tests, testId) => tests[tests.length - 1]; // TODO Use testid to find test

const testRuns = {
  namespaced: true,
  state: { 
    isRunning: undefined,
    lastSnapshot: undefined,
    // TODO Use testids and support multiple testruns in parallel
    tests: [],                
  },
  mutations: { 
    clearTests: (state) => {
      state.isRunning = false;
      state.tests = [];
    },
    addTest: (state, test) => {
      Vue.set(test, 'steps', [])
      Vue.set(test, 'result', 'running');
      Vue.set(state, 'tests', [...state.tests, test])
    },
    addStepToCurrentTest: (state, step) => {
      const currentTest = state.tests[state.tests.length - 1];

      if (step.snapshot) {
        state.lastSnapshot = step.snapshot;
      } else {
        Vue.set(step, 'snapshot', state.lastSnapshot);
      }
      Vue.set(step, 'result', 'passed');
      currentTest.steps.push(step);
    },
    updateStep: (state, step) => {
      const test = getTestById(state.tests, step.testid);
      const currentStep = test.steps[test.steps.length - 1];

      Vue.set(currentStep, 'returnValue', step.returnValue);
    },
    addMetaStepToCurrentTest: (state, metastep) => {
      const currentTest = state.tests[state.tests.length - 1];
        currentTest.steps.push({
          type: 'meta',
          result: 'passed',
          ...metastep
        });
    },
    addCommentToCurrentTest: (state, comment) => {
      const currentTest = state.tests[state.tests.length - 1];
      currentTest.steps.push({
        type: 'comment',
        result: 'passed',
        ...comment
      })
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

  },
  getters: {
    testRuns: state => {
      return state.tests
    },
    isRunning: state => {
      return state.isRunning;
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

    runScenario: async function ({ commit }, { scenarioId, profileName }) {
      if (!scenarioId) throw new Error('scenarioId is required');

      axios.post(`/api/scenarios/${encodeURIComponent(scenarioId)}/run`, { profileName });
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
    'SOCKET_test.before': function (context, test) {
      context.commit('addTest', test);
    },
    'SOCKET_test.after': function ({ dispatch, state }) {
      const currentTest = state.tests[state.tests.length - 1];
      dispatch('saveTestRun', currentTest);
    },
    'SOCKET_test.failed': function (context, error) {
      context.commit('markAsFailedCurrentTest', error);
    },
    'SOCKET_test.passed': function (context, data) {
      context.commit('markAsPassedCurrentTest', data);
    },
    'SOCKET_console.log': function (context, logEntry) {
      console.log(logEntry);
    },
    'SOCKET_step.comment': function (context, comment) {
      context.commit('addCommentToCurrentTest', comment);
    },
    'SOCKET_step.before': function (context, step) {
      context.commit('addStepToCurrentTest', step);
    },
    'SOCKET_step.passed': function ({commit}, step) {
      commit('updateStep', step);
    },
    'SOCKET_metastep.changed': function (context, metastep) {
      context.commit('addMetaStepToCurrentTest', metastep);
    }
  }
}

export default testRuns;