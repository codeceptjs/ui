<template>
  <div class="InteractiveShell box" v-if="isShowCli">

      <b-field label="Interactive Pause">
          <b-autocomplete
              ref="commands"
              v-model="command"
              placeholder="I."
              field="suggestion"
              class="commandInput"
              @select="selectAction"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
              :data="filteredActions"
              v-on:keyup.native.enter="sendCommand(command)"
              v-on:keydown.prevent.native.up="previousCommand()"
              v-on:keydown.prevent.native.down="nextCommand()"
              v-on:keydown.prevent.native.tab="completeCommand()"
              >
          </b-autocomplete>
      </b-field>

    <article class="InteractiveShell-error message is-danger" v-if="hasErrorCli">
      <div class="message-header">
        <p>Command failed</p>
      </div>
      <div class="message-body" v-html="cliError"></div>
    </article>

    <div v-if="successfulSteps.length" class="message  is-success">
      <div class="message-header">
        <p>Succesful Steps</p>
      </div>
      <pre v-highlightjs="stepsCode"><code class="javascript"></code></pre>
      <div class="hint">You can copy successful steps into to your test</div>
    </div>

    <div class="InteractiveShell-actions columns">
      <div class="column" v-if="showNextStep">
       <b-button v-on:click.once="nextStep()" type="is-primary" outlined>Next Step</b-button>
      </div>
      <div class="column text-right">
       <b-button v-on:click.once="closeInteractiveShell()" type="is-primary">Exit</b-button>
      </div>
    </div>

  </div>
</template>

<script>
import Convert from 'ansi-to-html';

export default {
  name: 'Pause',
  props: {
    showNextStep: {
      type: Boolean,
      default: false,
    }
  },
  data: function() {
    return {
      command: '',
      params: {},
      history: [],
      cursor: 0,
    };
  },
  created: async function() {
    await this.$store.dispatch('cli/loadActions');
    setTimeout(() => this.$refs['commands'] && this.$refs['commands'].focus(), 100);
  },
  mounted: function() {
    this.$refs['commands'] && this.$refs['commands'].focus();
    setTimeout(() => this.$refs['commands'] && this.$refs['commands'].focus(), 100);
  },
  computed: {
    filteredActions() {
      const actions = this.$store.getters['cli/actions'];
      return Object.keys(actions)
        .filter(action => action.startsWith(this.command))
        .sort((a, b) => a.length - b.length)
        .map(action => ({ action, suggestion: `${action}(${actions[action]})` }))
    },
    successfulSteps() {
      return this.$store.getters['cli/steps'];
    },    
    stepsCode() {
      return this.$store.getters['cli/steps'].map(step => {
        return `${step.actor}.${step.name}(${JSON.stringify(step.args).slice(1, -1)});`
      }).join(`\n`);
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
      const convert = new Convert();
      return convert.toHtml(this.$store.state.cli.message);
    },
  },
  methods: {
    selectAction(action) {
      if (!action || typeof action !== 'object') return false;
      this.$refs['commands'].setSelected(action.action + '()');
      setTimeout(() => {
        const input = this.$refs['commands'].$el.getElementsByTagName('input')[0];
        const pos = action.action.length+1;
        input.focus();
        input.setSelectionRange(pos, pos);
        input.focus();
      }, 0)
      return false;
    },
    previousCommand() {
      if (this.history[this.cursor]) {
        this.command = this.history[this.cursor];
        if (this.cursor < this.history.length) this.cursor++;
      }
    },
    nextCommand() {
      if (this.cursor > 0) this.cursor--;
      if (this.history[this.cursor]) {
        this.command = this.history[this.cursor];
      }
    },
    completeCommand() {
      if (this.$refs['commands'].data[0]) this.selectAction(this.$refs['commands'].data[0]);
      return false;
    },
    sendCommand(command) {
      this.history.unshift(command);
      this.cursor = 0;
      this.$store.commit('cli/clearCliError');
      this.$socket.emit('cli.line', command);
      this.command = '';
      this.$refs['commands'] && this.$refs['commands'].focus();
      setTimeout(() => this.$refs['commands'].focus(), 100);
    },
    closeInteractiveShell() {
      this.$socket.emit('cli.line', 'exit');
      this.$store.commit('cli/stopCli');
    },
    nextStep() {
      this.$socket.emit('cli.line', '');
    },

  }
}
</script>

<style lang="scss" scoped>
  .commandInput {
    @apply font-mono;
    input {      
      @apply text-sm;
      font-family: monospace !important;
    }
  }
  .hint {
    background: whitesmoke;
    @apply text-sm text-gray-600 text-center p-1;
  }
</style>