import axios from 'axios';
import Vue from 'vue';

const defaults = {
  editor: 'code --goto ',
};

if (!localStorage.codecept) {
  localStorage.codecept = JSON.stringify(defaults);
}

const settings = JSON.parse(localStorage.codecept);
Object.keys(settings).forEach(k => {
  if (!settings[k]) delete settings[k];
});

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
      Vue.set(state, 'isHeadless', isHeadless);
    },
    setSingleSession(state, isSingleSession) {
      Vue.set(state, 'isSingleSession', isSingleSession);
    },    
    setWindowSize(state, { width, height }) {
      Vue.set(state, 'windowSize', { width, height });
    },
    setEditor(state, editor) {
      if (editor) Vue.set(state, 'editor', editor);
    },
    setBrowser(state, browser) {
      if (browser) Vue.set(state, 'browser', browser);
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
