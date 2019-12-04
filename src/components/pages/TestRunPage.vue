<template>
  <div class="TestRun">
    <Header
      :loading="isRunning"
      @run="runScenario(scenario)"
    />
    <section class="test-view">
      <aside class="Sidebar">
        <div v-if="scenario && scenario.pending">
          <article class="message is-warning">
            <div class="message-body">
              <b-button
                class="float-right button"
                @click="editFile(scenario)"
                v-if="scenario.file"
              >
                <i class="fas fa-edit" />
                Edit
              </b-button>
              <h3 class="title is-6">
                {{ scenario.fullTitle }}
              </h3>
              This scenario is marked as skipped
            </div>
          </article>
        </div>
        <div v-else-if="scenario && tests.length > 0">
          <Test
            v-for="test in tests"
            :key="test.title"
            :test="test"
            :scenario="scenario"
            @select-step="onSelectStep"
          />
          <div class="LastTestMarker" />
        </div>
        <div v-else>
          <div v-if="scenario">
            <ScenarioSource
              :source="scenario.body"
              :file="scenario.file"
            />
          </div>
        </div>
      </aside>
      <div class="Content">
        <Snapshot
          v-if="hoveredOrSelectedStep"
          :selected="hoveredOrSelectedStep"
        />
        <div
          class="empty"
          v-else
        >
          <span>
            Once you
          </span>
          <a
            href="#"
            @click="runScenario(scenario)"
          >
            launch a test
          </a>
          you will see snapshots of all steps here.<br>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../Header';
import Test from '../Test';
import Snapshot from '../Snapshot';
import ScenarioSource from '../ScenarioSource';

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
};

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
    };
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
        this.loading = false;
        loadingComponent.close();
      }
    },

    editFile(scenario) {
      axios.get(`/api/tests/${encodeURIComponent(scenario.file)}/open`);
    },

    async loadLastTestRun() {
      return this.$store.dispatch('testRuns/loadTestRun', this.scenarioId);
    },

    runScenario(scenario) {
      this.$store.dispatch('testRuns/runScenario', scenario);
    },

    // TODO Do i still need this
    onSelectStep(step) {
      this.$store.commit('testRunPage/setSelectedStep', step);
    },
  }
};
</script>

<style scoped>

</style>
