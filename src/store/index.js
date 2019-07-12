import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
    state: {
        isRunning: undefined,
        show: 'source',
        lastSnapshot: undefined,
        selectedStep: undefined,
        tests: [],

        cli: undefined,
    },
    mutations: {
      clearTests: (state) => {
        state.isRunning = undefined;
        state.tests = [];
        state.selectedStep = undefined;
        state.cli = undefined;
      },
      addTest: (state, test) => {
        Vue.set(test, 'steps', [])
        Vue.set(test, 'result', 'running');
        Vue.set(state, 'tests', [...state.tests, test])
      },
      addStepToCurrentTest: (state, step) => {
        const currentTest = state.tests[state.tests.length - 1];
  
        if (step.snapshot) {
          state.lastSnapshot = step.snapshot;
        } else {
          Vue.set(step, 'snapshot', state.lastSnapshot);
        }
        Vue.set(step, 'result', 'passed');
        currentTest.steps.push(step);
      },
      markAsFailedCurrentTest: (state, data) => {
        const currentTest = state.tests[state.tests.length - 1];
        const currentStep = currentTest.steps[currentTest.steps.length - 1];
  
        currentTest.result = 'failed';
        Vue.set(currentTest, 'error', data.error);
        Vue.set(currentStep, 'result', 'failed');
      },
      markAsPassedCurrentTest: (state) => {
        const currentTest = state.tests[state.tests.length - 1];
        currentTest.result = 'passed';
      },
      setSelectedStep: (state, selectedStep) => {
        if (!selectedStep) return;
  
        state.selectedStep = selectedStep;
      },
      setRunning: (state, isRunning) => {
        state.isRunning = isRunning;
      },

      setShowImage: (state) => {
        state.show = 'image';
      },
      setShowSource: (state) => {
        state.show = 'source';
      },

      startCli: (state, data) => {
        state.cli = state.cli ? state.cli : {};
        
        state.cli.prompt = data.prompt;
        if (data.commands) {
          state.cli.commands = data.commands;
        }
      },
      stopCli: (state) => {
        state.cli = undefined;
      },
      clearCliError: (state) => {
        state.cli.message = undefined;
      },
      setCliError: (state, data) => {
        if (!state.cli) return;

        state.cli.message = data.message;
      }
    },
    plugins: [vuexLocal.plugin]
});

export default store;