<template>
  <div class="Test">

    <div class="TestRunHeader">
      <div class="TestRunHeader-meta is-size-7 has-text-grey-light is-pulled-right">
        <span v-if="test.startedAt">
          {{humanize(test.startedAt)}}
        </span>
      </div>
      <div class="columns is-gapless">
        <div class="column is-narrow">
          <i v-if="test.result == 'passed'" class="fas fa-check has-text-success" />
          <i v-if="test.result == 'failed'" class="fas fa-times has-text-danger" />
          <i v-if="test.result == 'running'" class="fas fa-circle-notch fa-spin has-text-grey" />
        </div>
        <div class="column">
          <h3 class="TestRun-title" v-if="scenario">{{scenario.title}}</h3>
          <span class="tag is-light" :key="tag" v-for="tag in scenario.tags">{{tag}}</span>
        </div>
      </div>
    </div>

    <div class="tabs is-small">
      <ul>
        <li :class="{ 'is-active': activeTab == 'testrun' }" @click="activateTab('testrun')" ><a>Testrun</a></li>
        <li :class="{ 'is-active': activeTab == 'source' }" @click="activateTab('source')"><a>Source</a></li>

      </ul>
      <div v-if="activeTab == 'testrun'" class="float-right" @click="toggleAll()"><a>Toggle substeps</a></div>
    </div>

    <div v-if="activeTab == 'source'">
      <ScenarioSource :source="scenario.body" />
    </div>

    <div v-if="activeTab == 'testrun'" class="TestrunStepsContainer">
      <ul class="TestRun-steps">
        <li 
          v-for="step in test.steps" 
          :key="step.title"
          @mouseover="setHoveredStep(step)"
          @mouseleave="unsetHoveredStep(step)"
          @click="toggleSubsteps(step)"
          :ref="step.section"
        >
          <step
            :class="'ml-' + indentLevel(step)"
            :step="step"
            :isOpened="step.opened"
            :isHovered="step === hoveredStep"
            :isSelected="step === selectedStep"
            @select-step="$emit('select-step', step)"
          />
        </li>
      </ul>

      <!-- TODO Create separate component -->
      <div class="InteractiveShell box" v-if="isShowCli">
        <div class="InteractiveShell-actions is-clearfix">
          <i class="InteractiveShell-closeButton fa fa-times is-pulled-right" v-on:click.once="closeInteractiveShell()" />
          <i class="InteractiveShell-nextStepButton fas fa-step-forward is-pulled-right" v-on:click="nextStep()"></i>
        </div>

        <article class="InteractiveShell-error message is-danger" v-if="hasErrorCli">
          <div class="message-header">
            <p>Command failed</p>
          </div>
          <div class="message-body">
            {{cliError}}
          </div>
        </article>

        <ul class="InteractiveShell-commands">
          <li v-on:click="execCommand('click')">
            <a href="">
              click
            </a>
          </li>
          <li>
            <a href="">
              fillField
            </a>
          </li>
          <li>
            <a href="">
              see
            </a>
          </li>
          <li>
            <a href="">
              other ...
            </a>

            <input 
              class="is-small input" 
              type="text" 
              placeholder="Enter CodeceptJS command" 
              v-model="command"  
              v-on:keyup.enter="sendCommand(command)" />
          </li>
        </ul>
      </div>

      <!-- TODO Create separate component -->
      <div v-if="test.result === 'failed'" class="Test-error notification is-danger">
        <p>
          {{trim(test.error.message)}}
        </p>
        <p>
          FAILED in {{test.duration}}s
        </p>
      </div>
      <div v-if="test.result === 'passed'" class="Test-passed notification is-success">
          PASSED in {{test.duration}}s
      </div>

      <div class="Test-spacer"></div>
    </div>

  </div>
</template>

<script>
import moment from 'moment';
import Step from './Step';
import ScenarioSource from './ScenarioSource';
import Convert from 'ansi-to-html';

export default {
  name: 'Test',
  props: ['test', 'scenario'],
  components: {
    Step, ScenarioSource,
  },
  data: function () {
    this.test.steps.forEach(s => s.opened = this.$store.getters['testRunPage/showSubsteps']);
    return {
      activeTab: 'testrun',
      command: undefined, 
    }
  },
  methods: {
    humanize(ts) {
      return moment.unix(ts / 1000).fromNow();
    },

    indentLevel(step) {
      if (!step.section) return 0;
      return step.section.split('_').length * 3;
    },

    activateTab(tabname) {
      this.activeTab = tabname;
    },

    toggleAll() {
      this.$store.commit('testRunPage/toggleSubsteps');
      const isOpened = this.$store.getters['testRunPage/showSubsteps'];
      this.test.steps.filter(s => s.type === 'meta').forEach(s => this.toggleSubsteps(s, isOpened));
      this.$forceUpdate();  
    },

    sendCommand(command) {
      this.$store.commit('clearCliError');
      this.$socket.emit('cli.line', command);
    },
    closeInteractiveShell() {
      this.$socket.emit('cli.line', 'exit');
      this.$store.commit('stopCli');
    },
    nextStep() {
      this.$socket.emit('cli.line', '');
    },
    trim(str) {
      return str.trim();
    },
    toggleSubsteps(step, isOpened) {
      if (step.type !== 'meta') return true;
      if (!step.opens) return true;
      step.opened = !step.opened;

      for (const section in this.$refs) {
        const els = this.$refs[section];
        if (section.startsWith(step.opens)) {
          if (typeof isOpened === 'boolean') {
            els.forEach(el => el.classList.toggle('hidden', isOpened))  
          }
          els.forEach(el => el.classList.toggle('hidden'));
        }
      }
    },
    setHoveredStep(step) {
      this.$store.commit('testRunPage/setHoveredStep', step);
    },
    unsetHoveredStep(step) {
      this.$store.commit('testRunPage/unsetHoveredStep', step);
    }
  },
  computed: {
    openAllSubsteps() {
      return this.$store.getters['testRunPage/showSubsteps']
    },

    isShowCli() {
      return this.$store.getters['cli/show'];
    },

    hasErrorCli() {
      return this.$store.state.cli && this.$store.state.cli.message;
    },

    cliPrompt() {
      return this.$store.state.cli.prompt;
    },

    cliError() {
      var convert = new Convert();

      return convert.toHtml(this.$store.state.cli.message);
    },

    hoveredStep() {
      return this.$store.getters['testRunPage/hoveredStep'];
    },
    selectedStep() {
      return this.$store.getters['testRunPage/selectedStep'];
    }
  }
}
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

.Test-spacer {
  height: 2em;
  width: 100%;
}

.Test-error {
  font-family: Inconsolata, monospace;
  font-size:0.9rem;
  margin-top: .5em;
}

.Test-passed {
  font-family: Inconsolata, monospace;
  margin-top: .5em;
  font-size:0.9rem;
  padding: .5em;
}

.InteractiveShell {
  margin-top: 1em;
}

.InteractiveShell-error {
  margin-top: 1em;
  font-size:0.9rem;
}

.InteractiveShell-closeButton {
  cursor: pointer;
  margin-left: 1em;
}

.InteractiveShell-nextStepButton {
  cursor: pointer;
  margin-left: 1em;
}
</style>
