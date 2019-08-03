import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = new Vuex.Store({
    state: {
        isRunning: undefined,
        show: 'source',
        lastSnapshot: undefined,
        selectedStep: undefined,
        hoveredStep: undefined,
        tests: [],

        scenarios: {
          selectedScenario: undefined,
        },

        cli: undefined,
    },

    mutations: {
      clearTests: (state) => {
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
      addMetaStepToCurrentTest: (state, metastep) => {
        const currentTest = state.tests[state.tests.length - 1];
        if (!metastep) {
          currentTest.steps.push({
            type: 'meta',
            result: 'passed',
          });  
        } else {
          currentTest.steps.push({
            type: 'meta',
            result: 'passed',
            ...metastep
          });
        }
      },
      markAsFailedCurrentTest: (state, data) => {
        const currentTest = state.tests[state.tests.length - 1];
        const currentStep = currentTest.steps[currentTest.steps.length - 1];
  
        currentTest.result = 'failed';
        Vue.set(currentTest, 'error', data.error);
        Vue.set(currentTest, 'duration', data.duration);

        Vue.set(currentStep, 'result', 'failed');
        if (data.snapshot) {
          Vue.set(currentStep, 'snapshot', data.snapshot);
        }
      },
      markAsPassedCurrentTest: (state, data) => {
        const currentTest = state.tests[state.tests.length - 1];
        const currentStep = currentTest.steps[currentTest.steps.length - 1];

        Vue.set(currentTest, 'duration', data.duration);
        currentTest.result = 'passed';
        if (data.snapshot) {
          Vue.set(currentStep, 'snapshot', data.snapshot);
        }
      },
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
      },

      selectScenario: (state, scenario) => {
        state.scenarios.selectedScenario = scenario;
      }
    },

    actions: {
      'SOCKET_codeceptjs.started': function (context) {
        context.commit('setRunning', true);
      },
      'SOCKET_codeceptjs.exit': function (context) {
        context.commit('setRunning', false);
      },
      'SOCKET_suite.before': function (context) {
        // TODO Check is this fired?
        context.commit('clearTests');
      },
      'SOCKET_test.before': function (context, test) {
        context.commit('addTest', test);
      },
      'SOCKET_test.failed': function (context, error) {
        context.commit('markAsFailedCurrentTest', error);
      },
      'SOCKET_test.passed': function (context, data) {
        context.commit('markAsPassedCurrentTest', data);
      },
      'SOCKET_step.say': function (context, msg) {
        console.log('SAY', msg);
      },
      'SOCKET_step.before': function (context, step) {
        context.commit('setSelectedStep', step);
        context.commit('addStepToCurrentTest', step);
      },
      'SOCKET_step.passed': function (context, step) {
        console.log('STEP.PASSED', step);
      },
      'SOCKET_metastep.changed': function (context, metastep) {
        context.commit('addMetaStepToCurrentTest', metastep);
      }
    },
    
    plugins: [vuexLocal.plugin]
});


export default store;