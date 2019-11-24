import axios from 'axios';

if (!localStorage.codecept) {
  localStorage.codecept = "{}";
}

const settings = {
  namespaced: true,
  state: JSON.parse(localStorage.codecept),
  getters: {
    windowSize: state => {
      return state.windowSize || { width: null, height: null };
    },
    isHeadless: state => state.isHeadless,
  },
  mutations: {
    setHeadless(state, isHeadless) {
      state.isHeadless = isHeadless;
    },
    setWindowSize(state, { width, height }) {
      state.windowSize = {
        width, height
      };
    }
  },
  actions: {
    setHeadless: async function({ commit, dispatch }, isHeadless) {
      commit('setHeadless', isHeadless);
      await dispatch('storeSettings');
    },

    setWindowSize: async function({ commit, dispatch }, size) {
      commit('setWindowSize', size);
      await dispatch('storeSettings');
    },

    storeSettings: async function ({ state }) {
      localStorage.codecept = JSON.stringify(state);
      await axios.put('/api/settings', state);
      return state;
    }
  }
}

export default settings;