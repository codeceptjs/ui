const scenarios = {
  namespaced: true,
  state: {
    selectedScenario: undefined,
  },
  mutations: {
    selectScenario: (state, scenario) => {
      state.scenarios.selectedScenario = scenario;
    }
  }
}

export default scenarios;
