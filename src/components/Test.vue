<template>
  <div class="Test">
    <div class="TestRunHeader">
      <div class="TestRunHeader-meta is-size-7 has-text-grey-light is-pulled-right">
        <span v-if="test.startedAt">
          {{ humanize(test.startedAt) }}
        </span>
      </div>
      <div class="columns is-gapless">
        <div class="column is-narrow">
          <i
            v-if="test.result == 'passed'"
            class="fas fa-check has-text-success"
          />
          <i
            v-if="test.result == 'failed'"
            class="fas fa-times has-text-danger"
          />
          <i
            v-if="test.result == 'running'"
            class="fas fa-circle-notch fa-spin has-text-grey"
          />
        </div>
        <div class="column">
          <h3
            class="TestRun-title"
          >
            {{ test.title }}
          </h3>
          <span
            class="tag is-light"
            :key="tag"
            v-for="tag in test.tags"
          >{{ tag }}</span>
        </div>
      </div>
    </div>
    <div class="tabs is-small">
      <br />
      <br />
      <ul>
        <li
          :class="{ 'is-active': activeTab == 'testrun' }"
          @click="activateTab('testrun')"
        >
          <a>Testrun</a>
        </li>
        <li
          :class="{ 'is-active': activeTab == 'source' }"
          @click="activateTab('source')"
        >
          <a>Source</a>
        </li>
      </ul>
      <div
        v-if="activeTab == 'testrun'"
        class="float-right"
        @click="toggleAll()"
      >
        <br />
        <br />
        <a><i class="fas fa-sort" />{{ isOpened ? 'Collapse' : 'Expand' }}</a>
      </div>
    </div>
    <div v-if="activeTab == 'source'">
      <ScenarioSource
        :source="scenario.body"
        :file="scenario.file"
      />
      <TestResult :test="test" />
    </div>
    <div
      v-if="activeTab == 'testrun'"
      class="TestrunStepsContainer"
    >
      <div
        class="empty"
        v-if="scenario === test"
      >
        No testruns yet
      </div>
      <ul class="TestRun-steps">
        <li
          v-for="step in test.steps"
          :key="step.title"
          @click="toggleSubsteps(step)"
          :ref="step.section"
        >
          <step
            :class="'ml-' + indentLevel(step)"
            :step="step"
            :is-opened="step.opened"
            :is-hovered="step === hoveredStep"
            :is-selected="step === selectedStep"
            @select-step="$emit('select-step', step)"
          />
        </li>
      </ul>
      <Pause show-next-step />
      <TestResult :test="test" />
    </div>
  </div>
</template>

<script>
import relativeTime from 'dayjs/plugin/relativeTime';
import Pause from './Pause';
import Step from './Step';
import ScenarioSource from './ScenarioSource';
import TestResult from './TestResult';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

export default {
  name: 'Test',
  props: {
    test: {
      type: Object,
      default: () => ({}),
    },
    scenario : {
      type: Object,
      default: () => ({}),
    }
  },
  components: {
    Step, ScenarioSource, Pause, TestResult,
  },
  data: function () {
    if (this.test.steps) {
      this.test.steps.forEach(s => s.opened = this.$store.getters['testRunPage/showSubsteps']);
    }
    return {
      activeTab: 'testrun',
      command: undefined,
      showNextStep: false,
    };
  },

  methods: {
    humanize(ts) {
      return dayjs(ts).fromNow();
    },

    indentLevel(step) {
      if (!step.section) return 0;
      return Math.min(step.section.split('_').length * 2, 12);
    },

    activateTab(tabname) {
      this.activeTab = tabname;
    },

    async toggleAll() {
      this.$store.commit('testRunPage/toggleSubsteps');
      this.test.steps.filter(s => s.type === 'meta').forEach(s => this.toggleSubsteps(s, !this.isOpened));
      this.$forceUpdate();
    },

    toggleSubsteps(step, force) {
      if (step.type !== 'meta') {
        step.expanded
          ? this.$store.commit('testRunPage/setHoveredStep', step)
          : this.$store.commit('testRunPage/unsetHoveredStep', step);
        return true;
      }

      if (!step.opens) return true;

      if(typeof force === 'boolean'){
        this.$set(step, 'opened', force);
        this.$set(step, 'expanded', force);
        this.$refs[step.opens].forEach(el=>{
          el.classList.toggle('hidden', force);
        });
      } else {
        this.$set(step, 'opened', !step.opened);
        this.$set(step, 'expanded', !step.expanded);
        this.$refs[step.opens].forEach(el=>{
          el.classList.toggle('hidden');
        });
      }
    },
  },
  computed: {
    openAllSubsteps() {
      return this.$store.getters['testRunPage/showSubsteps'];
    },
    hoveredStep() {
      return this.$store.getters['testRunPage/hoveredStep'];
    },
    selectedStep() {
      return this.$store.getters['testRunPage/selectedStep'];
    },
    isOpened() {
      return this.$store.getters['testRunPage/showSubsteps'];
    },
  }
};
</script>

<style scoped>
.TestRunHeader {

}

.TestRun-title {
  font-weight: bold;
  padding-left: .2em;
}

.TestRun-steps {
  line-height: 1em;
}

.tabs {
  margin-top: 15px;
}

</style>
