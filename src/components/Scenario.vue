<template>
  <div class="Scenario">
    <a
      class="Scenario-detailLink"
      @click="selectScenario(scenario)"
    >
      <span
        class="Scenario-status"
        v-if="existsTestStatus(scenario.id)"
      >
        <i
          v-if="testStatus(scenario.id) === 'failed'"
          class="fa fa-times mr-1 text-red-600"
        />
        <i
          v-if="testStatus(scenario.id) === 'passed'"
          class="fa fa-check-square mr-1 text-green-600"
        />
        <i
          v-if="testStatus(scenario.id) === 'running'"
          class="fas fa-circle-notch fa-spin has-text-grey"
        />
      </span>
      <span
        v-else
        class="Scenario-status"
      >
        <i class="fa fa-square mr-1 text-gray-600" />
      </span>
      <span :class="{ 'has-text-grey-light': scenario.pending, 'is-faded': !scenario.matchesQuery }">
        {{ scenario.title }}
      </span>
    </a>
    <b-tag
      class="Tag"
      rounded
      :key="tag"
      v-for="tag in scenario.tags"
    >
      {{ tag }}
    </b-tag>
    <span
      class="Scenario-property Scenario-duration has-text-grey-light"
      v-if="testDuration(scenario.id)"
    >
      {{ testDuration(scenario.id) }}s
    </span>
    <span
      class="Scenario-property Scenario-startedAt has-text-grey-light"
      v-if="testStartedAt(scenario.id)"
    >
      &middot;
      {{ humanize(testStartedAt(scenario.id)) }}
    </span>
    <span
      class="Scenario-property Scenario-startedAt has-text-danger"
      v-if="testErrorMessage(scenario.id)"
    >
      &middot;
      {{ testErrorMessage(scenario.id) }}
    </span>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export default {
  name: 'Scenario',
  props: {
    scenario: {
      type: Object,
      default: () => ({}),
    } ,
  },
  computed: {
    existsTestStatus() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        return status && typeof(status) === 'object' && status.status;
      };
    },
    testStatus() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        if (status) {
          return status.status;
        }
      };
    },
    testDuration() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        if (status) {
          return status.duration / 1000;
        }
      };
    },
    testStartedAt() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        if (status) {
          return status.startedAt;
        }
      };
    },
    testErrorMessage() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        if (status && status.error) {
          return status.error.message;
        }
      };
    }
  },
  methods: {
    humanize(ts) {
      return dayjs(ts).fromNow();
    },

    selectScenario(scenario) {
      // Emit test selection for IDE preview
      this.$emit('test-selected', scenario);
      
      // Navigate to test run page on mobile or when explicitly clicked
      this.$store.commit('scenarios/selectScenario', scenario);
      if (window.innerWidth < 1024) {
        this.$router.push(`/testrun/${encodeURIComponent(scenario.id)}`);
        this.$router.go();
      }
    }

  }
};
</script>
<style>

.is-faded {
  opacity: .5;
}

.Scenario {
}

.Scenario .Scenario-property {
  opacity: 0;
}

.Scenario:hover .Scenario-property {
  transition: all .3s;
  opacity: 1;
}
</style>
