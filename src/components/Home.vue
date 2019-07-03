<template>
  <div>
    <div class="Header">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <h3 class="title">codepress</h3>
          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      </nav>
   </div>

    <aside class="Sidebar">
      <test v-for="test in tests"
        v-bind:key="test.title"
        v-bind:test="test"
        v-bind:selectedStep="selectedStep"
        v-on:select-step="onSelectStep"
      />
    </aside>

    <div class="Content">
      <snapshot v-if="selectedStep"
        v-bind:selected="selectedStep"
      />
    </div>
  </div>
</template>

<script>
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
  name: 'Home',
  props: {},
  components: {
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
      this.$store.commit('clearTests');
      this.$store.commit('addTest', test);
    },
    'test.failed': function (error) {
      this.$store.commit('markAsFailedCurrentTest', error)
    },
    'test.passed': function () {
      this.$store.commit('markAsPassedCurrentTest')
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
  computed: {
    tests() {
      return this.$store.state.tests;
    },
    selectedStep() {
      return this.$store.state.selectedStep;
    },
  },
  methods: {
    onSelectStep(step) {
      this.$store.commit('setSelectedStep', step);
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
  width: 460px;
  background-color: #f5f5f5;
}

.Content {
  position: absolute;
  z-index: 10;
  top: 61px;
  left: 461px;
  right: 0;
  bottom: 0;
  overflow: hidden;
  padding: 10px;
}
</style>
