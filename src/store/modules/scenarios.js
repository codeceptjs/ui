const scenarios = {
  namespaced: true,
  state: {
    search: '',
    selectedScenario: undefined,
  },
  getters: {
    search: (state) => state.search
  },
  mutations: {
    setSearch: (state, search) => {
      state.search = search;
    },
    selectScenario: (state, scenario) => {
      state.selectedScenario = scenario;
    }
  }
}

export default scenarios;
