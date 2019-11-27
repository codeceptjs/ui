const profiles = {
  namespaced: true,
  state: {
    selectedProfileName: undefined,
  },
  getters: {
    selectedProfileName: (state) => {
      if (!state.selectedProfileName) {
        return undefined;
      }
      return state.selectedProfileName;
    }
  },
  mutations: {
    selectProfileName: (state, profileName) => {
      state.selectedProfileName = profileName;
    }
  }
};

export default profiles;