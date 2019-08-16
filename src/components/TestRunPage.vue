<template>
  <div class="TestRun">
    <div class="Header">
      <Header :loading="isRunning" @run="runScenario()" />
    </div>

    <aside class="Sidebar">
      <div v-if="scenario && tests.length > 0">
        <Test v-for="test in tests"
          :key="test.title"
          :test="test"
          :scenario="scenario"
          @select-step="onSelectStep"
        />
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
    const element = document.querySelector('.Test-spacer:last-child');
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
      scenario: undefined,
    }
  },
  created: function () {
    this.loadScenario();
  },
  computed: {
    tests() {
      return this.$store.state.tests;
    },
    hoveredOrSelectedStep() {
      return this.$store.state.hoveredStep || this.$store.state.selectedStep;
    },
    isRunning() {
      return this.$store.state.isRunning;
    }
  },
  methods: {
    loadScenario() {
      axios.get(`/api/scenarios/${this.$route.params.scenarioId}`)
        .then(response => {
            this.loading = false
            this.scenario = response.data
        })
        .catch(() => {
            this.loading = false
        })
    },

    runScenario() {
      axios.get(`/api/scenarios/${encodeURIComponent(this.scenario.title)}/run`);
      this.$store.commit('clearTests');
      this.$store.commit('setRunning', true);
    },

    onSelectStep(step) {
      this.$store.commit('setSelectedStep', step);
    },

    clearScenarioRuns() {
      this.$store.commit('clearTests');
    }
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
