import axios from 'axios';
import { ToastProgrammatic as Toast } from 'buefy';
import Vue from 'vue';

const scenarios = {
  namespaced: true,

  state: {
    parseError: undefined,
    search: '',                   // current search query
    selectedScenario: undefined,
    scenarios: {},                // keep scenario data
  },

  getters: {
    search: (state) => state.search,

    testStatus: state => scenarioId => {
      if (!state.scenarios[scenarioId]) {
        Vue.set(state.scenarios, scenarioId, {
          status: undefined,
          duration: undefined,
          startedAt: undefined
        });
      }
      return state.scenarios[scenarioId];
    }
  },

  mutations: {
    setParseError: (state, err) => {
      state.parseError = err;
    },
    setSearch: (state, search) => {
      state.search = search;
    },
    selectScenario: (state, scenario) => {
      state.selectedScenario = scenario;
    },

    setRunning: (state, value) => {
      state.isRunning = value;
    },
    setTestStatus: (state, { scenarioId, status }) => {
      state.scenarios[scenarioId] = status;
    },
    setInitialScenarioStatus: (state, initialStatus) => {
      const scenarioIds = Object.keys(initialStatus);
      scenarioIds.forEach(id => {
        Vue.set(state.scenarios, id, initialStatus[id]);
      });
    }
  },

  actions: {
    loadInitialScenarioStatus: async function ({ commit }) {
      const response = await axios.get('/api/scenario-status');
      commit('setInitialScenarioStatus', response.data);
    },

    'SOCKET_codeceptjs:scenarios.updated': function () {
      Toast.open({
        message: 'Scenarios have been reloaded',
        type: 'is-success'
      });
    },
    'SOCKET_codeceptjs:scenarios.parseerror': function ({ commit }, err) {
      commit('setParseError', err);

      const stackFrames = err.stack.split('\n');

      Toast.open({
        duration: 10000,
        message: `"${err.message}"\n${stackFrames[0]} in ${stackFrames[1]}`,
        position: 'is-top',
        type: 'is-danger'
      });
    },

    'SOCKET_test.before': function ({ commit }, test) {
      commit('setTestStatus', { scenarioId: test.id, status: { status: 'running' } });
    },
    'SOCKET_test.failed': function ({ commit }, step) {
      commit('setTestStatus', { scenarioId: step.testId, status: { 
        status: 'failed',
        startedAt: step.testStartedAt,
        duration: step.duration,
        error: step.error
      } 
      });
    },
    'SOCKET_test.passed': function ({ commit }, step) {
      commit('setTestStatus', { scenarioId: step.testId, status: { 
        status: 'passed',
        startedAt: step.testStartedAt,
        duration: step.duration,
      } 
      });
    },
  }
};

export default scenarios;
