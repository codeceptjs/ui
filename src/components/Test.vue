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
            v-if="scenario"
          >
            {{ scenario.title }}
          </h3>
          <span
            class="tag is-light"
            :key="tag"
            v-for="tag in scenario.tags"
          >{{ tag }}</span>
        </div>
      </div>
    </div>
    <div class="tabs is-small">
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
        <a><i class="fas fa-sort" />{{ isOpened ? 'Collapse' : 'Expand' }}</a>
      </div>
    </div>
    <div v-if="activeTab == 'source'">
      <ScenarioSource
        :source="scenario.body"
        :file="scenario.file"
      />
    </div>
    <div
      v-if="activeTab == 'testrun'"
      class="TestrunStepsContainer"
    >
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
      <Pause v-showNextStep />
      <TestResult :test="test" />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Pause from './Pause';
import Step from './Step';
import ScenarioSource from './ScenarioSource';
import TestResult from './TestResult';

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
    this.test.steps.forEach(s => s.opened = this.$store.getters['testRunPage/showSubsteps']);
    return {
      activeTab: 'testrun',
      command: undefined,
      isOpened: false,
    };
  },
  methods: {
    humanize(ts) {
      return moment.unix(ts / 1000).fromNow();
    },

    indentLevel(step) {
      if (!step.section) return 0;
      return Math.min(step.section.split('_').length * 2, 12);
    },

    activateTab(tabname) {
      this.activeTab = tabname;
    },

    toggleAll() {
      this.$store.commit('testRunPage/toggleSubsteps');
      this.isOpened = this.$store.getters['testRunPage/showSubsteps'];
      this.test.steps.filter(s => s.type === 'meta').forEach(s => this.toggleSubsteps(s, this.isOpened));
      this.$forceUpdate();
    },

    toggleSubsteps(step, isOpened) {
      if (step.type !== 'meta') {
        step.expanded
          ? this.$store.commit('testRunPage/setHoveredStep', step)
          : this.$store.commit('testRunPage/unsetHoveredStep', step);
        return true;
      }

      if (!step.opens) return true;
      this.$set(step, 'opened', !step.opened);
      this.$set(step, 'expanded', !step.expanded);

      for (const section in this.$refs) {
        if (section.startsWith(step.opens)) {
          const els = this.$refs[section];
          if (typeof isOpened === 'boolean') {
            if (!step.opened) els.forEach(el => el.classList.add('hidden'));
            if (step.opened) els.forEach(el => el.classList.remove('hidden'));
            return;
          }
          if (!step.opened) els.forEach(el => el.classList.add('hidden'));
          if (step.opened) els.forEach(el => el.classList.remove('hidden'));
        }
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
    }
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

</style>
