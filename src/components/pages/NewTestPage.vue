<template>
  <div class="TestRun">
    <Header
      :loading="isRunning"
      @run="runScenario(scenario)"
    />
    <aside class="Sidebar">
      <MonacoEditor 
        class="editor"
        v-model="code" 
        @editorDidMount="editorDidMount"
        language="javascript" 
      />
      
      <button
        v-if="!isRunning"
        @click="runScenario(scenario)"
        class="button is-medium is-primary is-fullwidth"
      >
        Launch Test
      </button>
      <ul
        class="TestRun-steps"
        v-if="test && isRunning"
      >
        <li
          v-for="step in test.steps"
          :key="step.title"
          :ref="step.section"
        >
          <step
            :step="step"
            :is-opened="step.opened || true"
            @select-step="selectStep(step)"
          />
        </li>
      </ul>
      <Pause :next-step="false" />
      <div class="LastTestMarker" />
    </aside>
    <div class="Content">
      <Snapshot
        v-if="hoveredOrSelectedStep"
        :selected="hoveredOrSelectedStep"
      />
      <div
        class="empty text-left  text-xl leading-relaxed"
        v-else
      >
        <h2 class="text-center font-bold mb-4">
          How to write a test
        </h2>
        <ul class="list-decimal list-inside leading-loose text-left">
          <li :class="{ 'line-through': isHeaded }">
            <a @click="enableWindowMode()">Force Window mode <i class="fas fa-window-maximize settings" /></a> to see the execution in actual browser
          </li>
          <li :class="{ 'line-through': isSingleSession }">
            <a @click="enableSingleSession()">Enable Singleton Browser Session</a> to reuse one window accross test runs
          </li>
          <li :class="{ 'line-through': isRunning }">
            Write the inital code and click <a @click="runScenario()">Launch Test</a>
          </li>
          <li>Resize the window to see both browsers (current and tested) on the screen</li>
          <li>Use interactive pause in the sidebar to send commands to a browser</li>
          <li>Copy successful commands into a test</li>
          <li>Rerun the updated test & save it to IDE</li>
          <li>Continue until the test is finished!</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';
import Header from '../Header';
import Snapshot from '../Snapshot';
import Pause from '../Pause';
import Step from '../Step';

export default {
  name: 'NewPage',

  props: {},
  components: {
    Header,
    Snapshot,
    Pause,
    MonacoEditor,
    Step,
  },
  data: function () {

    return {
      loading: false,
      scenario: {
        id: 'new-test',
        title: 'New Test',
        fullTitle: 'New Test',
        body: 'pause',
        steps: [],
      },
      code: `async ({ I }) => {
  I.amOnPage('/');
}`

    };
  },
  created: async function () {
    this.$store.dispatch('testRuns/clearTests');
    if (localStorage.getItem('newTestCommand') !== null) {
      this.code = localStorage.getItem('newTestCommand');  
    }
  },
  beforeDestroy: function() {
    localStorage.setItem('newTestCommand', this.code);
  },
  computed: {
    isHeaded() {
      return this.$store.state.settings.isHeadless === false;
    },
    isSingleSession() {
      return this.$store.state.settings.isSingleSession;
    },

    tests() {
      return this.$store.getters['testRuns/testRuns'];
    },
    hoveredOrSelectedStep() {
      return this.$store.getters['testRunPage/hoveredStep'] || this.$store.getters['testRunPage/selectedStep'];
    },
    isRunning() {
      return this.$store.getters['testRuns/isRunning'];
    },
    test() {
      return this.$store.getters['testRuns/currentTest'];
    },
    scenarioId() {
      return 'new-test';
    }
  },
  methods: {
    editorDidMount(editor) {
      editor.updateOptions({
        minimap: { enabled: false },
        lineNumbers: false,
        tabCompletion: 'onlySnippets',
      });
    },

    enableWindowMode() {
      this.$store.dispatch('settings/setHeadless', false);
    },

    enableSingleSession() {
      this.$store.dispatch('settings/setSingleSession', true);
    },

    async loadLastTestRun() {
      return this.$store.dispatch('testRuns/loadTestRun', this.scenarioId);
    },

    runScenario() {
      this.$store.dispatch('testRuns/runNewTest', this.code);
    },

    // TODO Do i still need this
    selectStep(step) {
      this.$store.commit('testRunPage/setSelectedStep', step);
    },
  }
};
</script>

<style lang="scss" scoped>
  .editor {
    @apply my-2 mt-16;
    width: 100%;
    height: 200px;
  }
  .Sidebar pre {
    margin: 0;
  }
  .empty ul a {
    @apply border-dashed border-b-2 border-gray-600;
  }
</style>
