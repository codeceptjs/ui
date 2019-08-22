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
    'SOCKET_codeceptjs:scenarios.parseerror': function ({ commit }, err) {
      commit('setParseError', err);
    },

  }
}

export default scenarios;
