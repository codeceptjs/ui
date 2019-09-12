<template>
  <div class="TestRun">
    <div class="Header">
      <Header :loading="isRunning" @run="runScenario(scenario)" />
    </div>

    <aside class="Sidebar">
      <div v-if="scenario && tests.length > 0">
        <Test v-for="test in tests"
          :key="test.title"
          :test="test"
          :scenario="scenario"
          @select-step="onSelectStep"
        />

        <div class="LastTestMarker"></div>
      </div>
      <div v-else>
        <div v-if="scenario">
          <ScenarioSource :source="scenario.body" />
        </div>
      </div>
    </aside>

    <div class="Content">
      <Snapshot v-if="hoveredOrSelectedStep"
        v-bind:selected="hoveredOrSelectedStep"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from './Header';
import Test from './Test';
import Snapshot from './Snapshot';
import ScenarioSource from './ScenarioSource';

const scrollToLastStep = () => {
  setTimeout(() => {
    const element = document.querySelector('.LastTestMarker');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, 100);     
}

export default {
  name: 'TestRun',
  props: {},
  components: {
    Header,
    Test,
    Snapshot,
    ScenarioSource
  },
  sockets: {
    'step.before': function () {
      scrollToLastStep();
    },
    'finish': function () {
      scrollToLastStep();
    }  
  },
  data: function () {
    return {
      loading: false,
      scenario: undefined,
    }
  },
  created: async function () {
    this.$store.commit('testRunPage/clearTests');
    await this.loadScenario();
    await this.loadLastTestRun(this.scenario);
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
    scenarioId() {
      return this.$route.params.scenarioId;
    }
  },
  methods: {
    async loadScenario() {
      const loadingComponent = this.$buefy.loading.open({ container: null });

      try {
        const response = await axios.get(`/api/scenarios/${encodeURIComponent(this.scenarioId)}`);
        this.scenario = response.data;
      } finally {
        this.loading = false
        loadingComponent.close();
      }
    },

    async loadLastTestRun(scenario) {
      return this.$store.dispatch('testRuns/loadTestRun', this.scenarioId);
    },

    runScenario(scenario) {
      const profileName = this.$store.getters['profiles/selectedProfileName'];
      // TODO Use scenario id to run it
      const scenarioId = scenario.title;
      this.$store.dispatch('testRuns/runScenario', { scenarioId, profileName });
    },

    // TODO Do i still need this
    onSelectStep(step) {
      this.$store.commit('testRunPage/setSelectedStep', step);
    },
  }
}
</script>

<style scoped>
.Header {
  height: 60px;
  padding: 0 5px;
  box-shadow: 0 2px 0 0 #f5f5f5;
}

.Sidebar {
  position: absolute;
  z-index: 10;
  top: 61px;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 5px 5px 5px 10px;
  width: 33%;
  background-color: #fafafa;
}

.Content {
  position: absolute;
  z-index: 10;
  top: 61px;
  left: 33%;
  right: 0;
  bottom: 0;
  overflow: hidden;
  padding: 10px;
}
</style>
