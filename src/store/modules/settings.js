import axios from 'axios';

const defaults = {
  editor: 'code --goto ',
};

if (!localStorage.codecept) {
  localStorage.codecept = JSON.stringify(defaults);
}

const settings = JSON.parse(localStorage.codecept);

// initialize current settings on backend
axios.put('/api/settings', settings);

export default {
  namespaced: true,
  state: settings,
  getters: {
    windowSize: state => {
      return state.windowSize || { width: null, height: null };
    },
  },
  mutations: {
    setHeadless(state, isHeadless) {
      state.isHeadless = isHeadless;
    },
    setSingleSession(state, isSingleSession) {
      state.isSingleSession = isSingleSession;
    },    
    setWindowSize(state, { width, height }) {
      state.windowSize = {
        width, height
      };
    },
    setEditor(state, editor) {
      state.editor = editor;
    },
    setBrowser(state, browser) {
      state.browser = browser;
    },

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
    setEditor: async function({ commit, dispatch}, editor) {
      commit('setEditor', editor);
      await dispatch('storeSettings');
    },
    setSingleSession: async function({ commit, dispatch}, isSingleSession) {
      commit('setSingleSession', isSingleSession);
      await dispatch('storeSettings');
    },    
    setBrowser: async function({ commit, dispatch}, browser) {
      commit('setBrowser', browser);
      await dispatch('storeSettings');
    },
    storeSettings: async function ({ state }) {
      localStorage.codecept = JSON.stringify(state);
      await axios.put('/api/settings', state);
      return state;
    },
  }
};
