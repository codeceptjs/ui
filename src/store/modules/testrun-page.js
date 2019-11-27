const testRunPage = {
  namespaced: true,

  state: {
    show: 'source',
    selectedStep: undefined,
    hoveredStep: undefined,
    showSubsteps: true,
  },
  getters: {
    hoveredStep: state => {
      return state.hoveredStep;
    },
    selectedStep: state => {
      return state.selectedStep;
    },
    showImage: state => {
      return state.show === 'image';
    },
    showSource: state => {
      return state.show === 'source';
    },
    showSubsteps: state => state.showSubsteps
  },
  mutations: {
    clearTests: (state) => {
      state.selectedStep = undefined;
    },

    toggleSubsteps: (state) => state.showSubsteps = !state.showSubsteps,

    setSelectedStep: (state, selectedStep) => {
      if (!selectedStep) return;
      state.selectedStep = selectedStep;
    },

    setHoveredStep: (state, hoveredStep) => {
      if (!hoveredStep) return;
      if (hoveredStep.type === 'meta') return;
      state.hoveredStep = hoveredStep;
    },

    unsetHoveredStep: (state) => {
      state.hoveredStep = undefined;
    },

    setShowImage: (state) => {
      state.show = 'image';
    },

    setShowSource: (state) => {
      state.show = 'source';
    }
  },
  actions: {
    'SOCKET_step.before': function (context, step) {
      context.commit('setSelectedStep', step);
    },
  }
};

export default testRunPage;
