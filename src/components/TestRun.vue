<template>
  <div class="TestRun">
    <div class="Header">
      <Header :loading="isRunning" v-on:run="run()" />
    </div>

    <aside class="Sidebar">
      <Test v-for="test in tests"
        v-bind:key="test.title"
        v-bind:test="test"
        v-bind:selectedStep="selectedStep"
        v-on:select-step="onSelectStep"
      />
    </aside>

    <div class="Content">
      <Snapshot v-if="selectedStep"
        v-bind:selected="selectedStep"
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
    const element = document.querySelector('.Test-spacer');
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
    connect: function () {},
    'suite.before': function () {
      // TODO Check is this fired?
      this.$store.commit('clearTests');
      this.$store.commit('setRunning', true);
    },
    'test.before': function (test) {
      this.$store.commit('addTest', test);
    },
    'test.failed': function (error) {
      this.$store.commit('markAsFailedCurrentTest', error);
    },
    'test.passed': function (data) {
      this.$store.commit('markAsPassedCurrentTest', data);
    },
    'step.before': function (step) {
      this.$store.commit('setSelectedStep', step);
      this.$store.commit('addStepToCurrentTest', step);

      scrollToLastStep();
    },
    'finish': function () {
      this.$store.commit('setRunning', false);

      scrollToLastStep();
    }
  },
  created: function () {
    this.$store.commit('clearTests');
  },
  computed: {
    tests() {
      return this.$store.state.tests;
    },
    selectedStep() {
      return this.$store.state.selectedStep;
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
      axios.get(`/api/scenarios/${encodeURIComponent(scenario)}/run`);

      this.$store.commit('clearTests');
      this.$store.commit('setRunning', true);
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
