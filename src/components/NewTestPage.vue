<template>
  <div class="TestRun">
    <Header :loading="isRunning" @run="runScenario(scenario)" />

    <aside class="Sidebar">

        <prism-editor v-model="code" language="js"></prism-editor>

        <button v-if="!isRunning" @click="runScenario(scenario)" class="button is-medium is-primary is-fullwidth">
          Launch Test
        </button>

      <ul class="TestRun-steps" v-if="test && isRunning">
        <li 
          v-for="step in test.steps" 
          :key="step.title"
          :ref="step.section"
        >
          <step
            :step="step"
            :isOpened="step.opened || true"
            @select-step="selectStep(step)"
          />
        </li>
      </ul>
        <TestResult :test="test" v-if="test && isRunning"></TestResult>

        <Pause :nextStep="false"></Pause>


        <div class="LastTestMarker"></div>
    </aside>

    <div class="Content">
      <Snapshot v-if="hoveredOrSelectedStep"
        v-bind:selected="hoveredOrSelectedStep"
      />
      <div class="empty" v-else>
        Once you <a href="#" @click="runScenario(scenario)">launch a test</a> you will see snapshots of all steps here.<br>
        It is recommended to write test disabling headless mode
        <br>to see the actual execution of a test.
      </div>
    </div>
    </div>
</template>

<script>
import "prismjs";
import "prismjs/themes/prism.css";
import PrismEditor from 'vue-prism-editor';
import Header from './Header';
import Snapshot from './Snapshot';
import Pause from './Pause';
import Step from './Step';
import TestResult from "./TestResult";

export default {
  name: 'NewPage',

  props: {},
  components: {
    Header,
    Snapshot,
    Pause,
    PrismEditor,
    Step,
    TestResult,
  },
  data: function () {
    return {
      loading: false,
      scenario: {
        id: 'new-test',
        title: 'New Test',
        fullTitle: 'New Test',
        body: 'pause',
        steps: [],
      },
      code: `async (I) => {
  I.amOnPage('/');
}`

    };
  },
  created: async function () {
    this.$store.dispatch('testRuns/clearTests');
  },

  computed: {
    tests() {
      return this.$store.getters['testRuns/testRuns'];
    },
    hoveredOrSelectedStep() {
      return this.$store.getters['testRunPage/hoveredStep'] || this.$store.getters['testRunPage/selectedStep'];
    },
    isRunning() {
      return this.$store.getters['testRuns/isRunning'];
    },
    test() {
      return this.$store.getters['testRuns/currentTest'];
    },
    scenarioId() {
      return 'new-test';
    }
  },
  methods: {

    async loadLastTestRun() {
      return this.$store.dispatch('testRuns/loadTestRun', this.scenarioId);
    },    

    runScenario() {
      this.$store.dispatch('testRuns/runNewTest', this.code);
    },

    // TODO Do i still need this
    selectStep(step) {
      this.$store.commit('testRunPage/setSelectedStep', step);
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
