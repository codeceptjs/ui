<template>
  <div class="TestRun">
    <div class="Header">
      <Header :loading="isRunning" v-on:run="run()" />
    </div>

    <aside class="Sidebar">
      <div v-if="tests.length > 0">
        <Test v-for="test in tests"
          v-bind:key="test.title"
          v-bind:test="test"
          v-on:select-step="onSelectStep"
        />
      </div>
      <div v-else>
        <div>
           <p>
             {{selectedScenario}}
          </p>
          <div class="has-text-grey-light has-text-centered">This scenario has not been run yet.</div>
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
    Snapshot
  },
  sockets: {
    'step.before': function () {
      scrollToLastStep();
    },
    'finish': function () {
      scrollToLastStep();
    }  
  },
  created: function () {
    if (!this.hasScenarioRun(this.$route.params.scenario)) {
      this.clearScenarioRuns();
    }
  },
  computed: {
    selectedScenario() {
      return this.$route.params.scenario;
    },
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
    onSelectStep(step) {
      this.$store.commit('setSelectedStep', step);
    },

    run() {
      const scenario = this.$route.params.scenario;
      // axios.get(`/api/scenarios/${encodeURIComponent(scenario)}/run-ips`); // run in process
      axios.get(`/api/scenarios/${encodeURIComponent(scenario)}/run`);

      this.$store.commit('clearTests');
      this.$store.commit('setRunning', true);
    },

    hasScenarioRun(scenario) {
       const scenarios = this.$store.state.tests;
       return scenarios.find(s => s.title === scenario)
    },

    clearScenarioRuns() {
      this.$store.commit('clearTests');
      this.$store.commit('setRunning', false);
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
