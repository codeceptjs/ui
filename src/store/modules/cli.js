// TODO Fix this
const cli = {
  namespaced: true,

  state: {
    cli: undefined,
    prompt: undefined,
    commands: undefined,
    message: undefined,
  },
  mutations: {
    startCli: (state, data) => {
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
    },
    clearCliError: (state) => {
      state.message = undefined;
    },
    setCliError: (state, data) => {
      if (!state) return;
      state.message = data.message;
    },
  },
  getters: {
    show: state => {
      return state.cli !== undefined;
    }
  },
  actions: {
    'SOCKET_cli.start': function ({ commit }, data) {
      commit('startCli', data);
    },
    'SOCKET_cli.stop': function ({ commit }, data) {
      commit('stopCli', data);
    },
    'SOCKET_cli.output': function ({ commit }, data) {
    },
    'SOCKET_cli.error': function ({ commit }, data) {
      commit('setCliError', data);
    },
  }
}

export default cli;
