const profiles = {
    namespaced: true,
    state: {
        selectedProfileName: undefined,
    },
    getters: {
        selectedProfileName: (state) => {
            if (!state.selectedProfileName) {
                return 'None';
            }
            return state.selectedProfileName;
        }
    },
    mutations: {
        selectProfileName: (state, profileName) => {
            state.selectedProfileName = profileName;
        }
    }
}

module.exports = profiles;