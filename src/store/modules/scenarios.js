import { ToastProgrammatic as Toast } from 'buefy'

const scenarios = {
  namespaced: true,
  state: {
    parseError: undefined,
    search: '',
    selectedScenario: undefined,
  },
  getters: {
    search: (state) => state.search
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
    }
  },
  actions: {
    'SOCKET_codeceptjs:scenarios.updated': function () {
      Toast.open({
        message: 'Scenarios have been reloaded',
        type: 'is-success'
      })
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

  }
}

export default scenarios;
