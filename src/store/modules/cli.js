const axios = require('axios');

const cli = {
  namespaced: true,

  state: {
    cli: undefined,
    prompt: undefined,
    commands: undefined,
    message: undefined,
    actions: {},
    steps: [],
  },
  mutations: {
    startCli: (state, data) => {
      state.cli = true;
      state.prompt = data.prompt;
      if (data.commands) {
        state.commands = data.commands;
      }
    },
    stopCli: (state) => {
      state.cli = undefined;
      state.prompt = undefined;
      state.commands = undefined;
      state.message = undefined;
      state.steps = [];
    },
    clearCliError: (state) => {
      state.message = undefined;
    },
    setCliError: (state, data) => {
      if (!state) return;
      state.message = data.message;
    },
    addStep: (state, step) => {
      if (!state.cli || !step.store) return;
      if (step.result !== 'passed') return;
      if (!step.store.debugMode) return;
      state.steps.push(step);
    }
  },
  getters: {
    steps: state => state.steps,
    show: state => {
      return state.cli !== undefined;
    },
    actions: state => state.actions,
  },
  actions: {
    loadActions: async ({ state }) => {
      try {
        const resp = await axios.get('/api/actions');
        state.actions = resp.data.actions;
      } catch (err) {
        state.actions = {};
      }
    },
    'SOCKET_cli.start': function ({ commit }, data) {
      commit('startCli', data);
    },
    'SOCKET_cli.stop': function ({ commit }, data) {
      commit('stopCli', data);
    },
    'SOCKET_cli.output': function () {
    },
    'SOCKET_cli.error': function ({ commit }, data) {
      commit('setCliError', data);
    },
    'SOCKET_step.before': function ({commit}, step) {
      commit('addStep', step);
    },
  }
};

export default cli;
