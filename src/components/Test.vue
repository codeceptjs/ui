<template>
  <div class="Test">

    <div class="columns">
      <div class="column is-1">
        <i v-if="test.result == 'passed'" class="fas fa-check has-text-success" />
        <i v-if="test.result == 'failed'" class="fas fa-times has-text-danger" />
        <i v-if="test.result == 'running'" class="fas fa-circle-notch fa-spin has-text-grey" />
      </div>
      <div class="column">
        {{test.title}}
      </div>
    </div>

    <ul class="menu-list">
      <li 
        v-for="step in test.steps" 
        v-bind:key="step.title"
        @mouseover="setHoveredStep(step)"
        @mouseleave="unsetHoveredStep(step)"
      >
        <step
          :step="step"
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
</template>

<script>
import Step from './Step';
import Convert from 'ansi-to-html';

export default {
  name: 'Test',
  props: ['test', 'selectedStep'],
  components: {
    Step,
  },
  data: function () {
    return {
      command: undefined,
    }
  },
  sockets: { // TODO Move this to store
    'cli.start': function (data) {
      // eslint-disable-next-line no-console
      console.log('Start cli', data);
      this.$store.commit('startCli', data);
    },
    'cli.stop': function (data) {
      // eslint-disable-next-line no-console
      console.log('Start cli', data);
      this.$store.commit('stopCli', data);
    },
    'cli.output': function (data) {
      // eslint-disable-next-line no-console
      console.log('Output', data);
    },
    'cli.error': function (data) {
      // eslint-disable-next-line no-console
      console.log('Error', data);
      this.$store.commit('setCliError', data);
    },
  },
  methods: {
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
    setHoveredStep(step) {
      this.$store.commit('setHoveredStep', step);
    },
    unsetHoveredStep(step) {
      this.$store.commit('unsetHoveredStep', step);
    }
  },
  computed: {
    isShowCli() {
      return this.$store.state.cli !== undefined;
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
      return this.$store.state.hoveredStep;
    },
    selectedStep() {
      return this.$store.state.selectedStep;
    }
  }
}
</script>

<style scoped>
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
