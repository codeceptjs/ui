<template>
  <nav>
    <transition
      name="slide-fade"
      mode="out-in"
    >
      <div
        class="stats level"
        v-if="!isRunning"
        key="stats"
      >
        <div class="level-item text-green-600">
          <i
            class="far fa-check-circle mr-1"
            aria-hidden="true"
          />
          <span class=" is-hidden-touch">Successful</span>
          <span class="counter"> {{ successful }}</span>
        </div>
        <div class="level-item text-red-600">
          <i
            class="far fa-times-circle mr-1"
            aria-hidden="true"
          />
          <span class=" is-hidden-touch">Failed</span>
          <span class="counter"> {{ failed }}</span>
        </div>
        <div class="level-item">
          <div class="field">
            <i
              class="fas fa-forward mr-1"
              aria-hidden="true"
            />
            <span class=" is-hidden-touch">Skipped</span>
            <span class="counter">{{ skipped }}</span>
          </div>
        </div>
        <div class="level-item">
          <i
            class="far fa-hourglass mr-1"
            aria-hidden="true"
          />
          <span class=" is-hidden-touch">Not Started</span>
          <span class="counter">{{ pending }}</span>
        </div>
        <div class="level-item">
          <i
            class="fas fa-list mr-1"
            aria-hidden="true"
          />
          <span class=" is-hidden-touch">Suites</span>
          <span class="counter">{{ totalFeatures }}</span>
        </div>
      </div>
      <div
        class="currentTest level "
        v-else
        key="test"
      >
        <div class="level-item is-hidden-touch">
          Running...
        </div>
        <div
          class="level-item"
          v-if="currentTest"
        >
          <a @click="openTest(currentTest)">
            <span class="suiteTitle is-hidden-touch">
              {{ currentTest.suite }} &rarr;
            </span>
            <i class="fas fa-circle-notch fa-spin ml-2" />&nbsp;
            <span class="testTitle ml-1">{{ currentTest.title }}</span>
          </a>
        </div>
        <div
          class="level-item"
          v-if="currentTest"
        >
          <b-button
            @click="openTest(currentTest)"
            type="is-warning"
            v-if="isPaused"
            size="is-small"
          >
            <span class="preview">
              <i class="fas fa-pause mr-2" />&nbsp;Paused. Waiting for input...
            </span>
          </b-button>
          <b-button
            @click="openTest(currentTest)"
            type="is-info"
            v-else
            size="is-small"
            outlined
          >
            <span class="preview">
              <i class="fas fa-eye mr-2" />&nbsp;Live Preview
            </span>
          </b-button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
export default {
  name: 'TestStatistics',
  props: {
    features: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      scenarios: this.scenarioIds
    };
  },
  methods: {
    openTest(scenario) {
      this.$store.commit('scenarios/selectScenario', scenario);
      this.$router.push(`/testrun/${encodeURIComponent(scenario.id)}`);
    }
  },
  computed: {
    isPaused() {
      return this.$store.getters['cli/show'];
    },
    isRunning: function() {
      return this.$store.getters['testRuns/isRunning'];
    },
    currentTest: function() {
      return this.$store.getters['testRuns/currentTest'];
    },
    totalFeatures: function() {
      let total = 0;
      for (const test in this.features) {
        total += this.features[test].length;
      }
      return total;
    },
    scenarioIds: function() {
      let scenarios = [];
      for (const testFolder in this.features) {
        const ids = this.features[testFolder].reduce((arr, test) => {
          return arr.concat(test.scenarios.map(scenario => scenario.id));
        }, []);
        scenarios = [...scenarios, ...ids];
      }
      return scenarios;
    },
    successful: function() {
      return this.scenarioIds
        .map(id => this.$store.getters['scenarios/testStatus'](id))
        .filter(scenario => scenario.status === 'passed').length;
    },
    failed: function() {
      return this.scenarioIds
        .map(id => this.$store.getters['scenarios/testStatus'](id))
        .filter(scenario => scenario.status === 'failed').length;
    },
    skipped: function() {
      let scenarios = [];
      for (const testFolder in this.features) {
        const ids = this.features[testFolder].reduce((arr, test) => {
          return arr.concat(
            test.scenarios.filter(scenario => scenario.pending)
          );
        }, []);
        scenarios = [...scenarios, ...ids];
      }
      return scenarios.length;
    },
    pending: function() {
      return this.scenarioIds
        .map(id => this.$store.getters['scenarios/testStatus'](id))
        .filter(scenario => scenario.status === undefined).length;
    }
  }
};
</script>

<style scoped lang="scss">
nav {
  z-index: 100;
  @apply bg-gray-100 fixed inset-x-0 bottom-0 p-1;
  & > div {
    display: flex;
    align-items: baseline;
  }
}

.stats {
  .counter {
    display: inline-block;
    @apply font-bold text-gray-600 ml-4;
  }
}

.currentTest {

  .testTitle {
    display: inline-block;
    @apply text-purple-800 font-bold;
  }

  .suiteTitle {
    display: inline-block;
    @apply text-gray-600 mr-8 ;
  }

}

.preview {
  animation: blinker 3s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0.5;
  }
}


.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(50px);
  opacity: 0;
}
</style>
