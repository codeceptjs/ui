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
          <div class="stat-item">
            <i
              class="far fa-check-circle mr-1"
              aria-hidden="true"
            />
            <span class="is-hidden-touch">Successful</span>
            <span class="counter success-badge"> {{ successful }}</span>
            <div class="progress-bar" v-if="totalTests > 0">
              <div class="progress-fill success" :style="{ width: successPercentage + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="level-item text-red-600">
          <div class="stat-item">
            <i
              class="far fa-times-circle mr-1"
              aria-hidden="true"
            />
            <span class="is-hidden-touch">Failed</span>
            <span class="counter error-badge"> {{ failed }}</span>
            <div class="progress-bar" v-if="totalTests > 0">
              <div class="progress-fill error" :style="{ width: failedPercentage + '%' }"></div>
            </div>
          </div>
        }
        <div class="level-item">
          <div class="stat-item">
            <i
              class="fas fa-forward mr-1"
              aria-hidden="true"
            />
            <span class="is-hidden-touch">Skipped</span>
            <span class="counter skip-badge">{{ skipped }}</span>
          </div>
        </div>
        <div class="level-item">
          <div class="stat-item">
            <i
              class="far fa-hourglass mr-1"
              aria-hidden="true"
            />
            <span class="is-hidden-touch">Pending</span>
            <span class="counter pending-badge">{{ pending }}</span>
          </div>
        </div>
        <div class="level-item">
          <div class="stat-item">
            <i
              class="fas fa-list mr-1"
              aria-hidden="true"
            />
            <span class="is-hidden-touch">Total</span>
            <span class="counter total-badge">{{ totalTests }}</span>
          </div>
        </div>
      </div>
      <div
        class="currentTest level"
        v-else
        key="test"
      >
        <div class="level-item is-hidden-touch">
          <div class="running-indicator">
            <i class="fas fa-circle-notch fa-spin mr-2" />
            <span class="running-text">Running Tests...</span>
          </div>
        </div>
        <div
          class="level-item test-info"
          v-if="currentTest"
        >
          <a @click="openTest(currentTest)" class="current-test-link">
            <span class="suiteTitle is-hidden-touch">
              {{ currentTest.suite }} &rarr;
            </span>
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
            class="pulse-button"
          >
            <span class="preview">
              <i class="fas fa-pause mr-2" />Paused - Waiting for input
            </span>
          </b-button>
          <b-button
            @click="openTest(currentTest)"
            type="is-info"
            v-else
            size="is-small"
            outlined
            class="live-preview-btn"
          >
            <span class="preview">
              <i class="fas fa-eye mr-2" />Live Preview
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
    totalTests: function() {
      return this.scenarioIds.length;
    },
    successPercentage: function() {
      return this.totalTests > 0 ? (this.successful / this.totalTests) * 100 : 0;
    },
    failedPercentage: function() {
      return this.totalTests > 0 ? (this.failed / this.totalTests) * 100 : 0;
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
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .counter {
    display: inline-block;
    @apply font-bold text-white ml-2 px-2 py-1 rounded text-sm;
    min-width: 24px;
    text-align: center;
    
    &.success-badge {
      @apply bg-green-500;
    }
    
    &.error-badge {
      @apply bg-red-500;
    }
    
    &.skip-badge {
      @apply bg-yellow-500 text-gray-800;
    }
    
    &.pending-badge {
      @apply bg-gray-400;
    }
    
    &.total-badge {
      @apply bg-blue-500;
    }
  }
  
  .progress-bar {
    width: 40px;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 2px;
      
      &.success {
        @apply bg-green-500;
      }
      
      &.error {
        @apply bg-red-500;
      }
    }
  }
}

.currentTest {
  .running-indicator {
    @apply text-blue-600 font-semibold;
    
    .running-text {
      @apply text-sm;
    }
  }
  
  .test-info {
    flex: 1;
    margin: 0 20px;
  }
  
  .current-test-link {
    display: block;
    @apply text-purple-800 font-bold text-center p-2 rounded;
    transition: background-color 0.2s ease;
    
    &:hover {
      @apply bg-purple-50;
    }
  }

  .testTitle {
    display: inline-block;
    @apply text-purple-800 font-bold;
  }

  .suiteTitle {
    display: inline-block;
    @apply text-gray-600 mr-2;
  }

  .live-preview-btn {
    animation: subtle-pulse 2s infinite;
  }
  
  .pulse-button {
    animation: urgent-pulse 1s infinite;
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

@keyframes subtle-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

@keyframes urgent-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
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
