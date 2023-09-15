<template>
  <div>
    <b-message
      v-if="showSuccessfulSteps"
      title="Successful Steps"
      aria-close-label="Close succesful steps"
    >
      <pre v-highlightjs="stepsCode"><code class="javascript" /></pre>
      <div class="hint">
        You can <a @click="copy(stepsCode)">copy successful steps</a> and paste into to your test
      </div>
    </b-message>

    <div
      class="InteractiveShell box"
      v-if="isShowCli"
    >
      <div class="interactiveBox">
        <div class="field show-doc hide-on-small">
          <b-checkbox
            v-model="showDoc"
            size="is-small"
          >
            Show Documentation
          </b-checkbox>
        </div>
        <b-field>
          <template slot="label">
            <div>
              <i class="fas mr-2 fa-pause" />
              Execution Paused
            </div>
          </template>

          <b-autocomplete
            ref="commands"
            v-model="command"
            field="suggestion"
            class="commandInput"
            :open-on-focus="true"
            :data="filteredActions"
            @select="selectAction"
            @keyup.native.enter="sendCommand(command)"
            @keydown.prevent.native.up="previousCommand()"
            @keydown.prevent.native.down="nextCommand()"
            @keydown.prevent.native.tab="completeCommand()"
          >
            <template slot-scope="props">
              <div 
                :class="props.option.actionType" 
                class="cmd"
              >
                {{ props.option.suggestion }}
              </div> 
            </template>
          </b-autocomplete>
        </b-field>
        <div class="text-sm text-gray-600 mb-4">
          Browser is still open. Use provided commands to continue interaction.
        </div>
        <b-message
          aria-close-label="Close message"
          type="is-danger"
          v-if="hasErrorCli"
        >
          <div v-html="cliError" />
        </b-message>

        <ul        
          class="interactiveOptions"
          v-show="command.length===0"
        >
          <li          
            @click="selectedAction('see')"
          >
            <span>
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.3475 9.49891C12.3475 11.0083 11.0703 12.2319 9.49484 12.2319C7.91936 12.2319 6.64218 11.0083 6.64218 9.49891C6.64218 7.98949 7.91936 6.76589 9.49484 6.76589C11.0703 6.76587 12.3475 7.9895 12.3475 9.49891ZM9.5 3.80835C7.86877 3.81559 6.17794 4.2127 4.57735 4.973C3.38894 5.56077 2.23076 6.39002 1.2254 7.41357C0.731627 7.93605 0.101824 8.6926 0 9.4998C0.0120333 10.199 0.762058 11.0621 1.2254 11.586C2.16817 12.5694 3.29618 13.3755 4.57735 14.0272C6.06998 14.7516 7.72211 15.1687 9.5 15.1919C11.1328 15.1845 12.8232 14.7828 14.422 14.0272C15.6105 13.4394 16.7692 12.6096 17.7746 11.586C18.2684 11.0636 18.8982 10.307 19 9.4998C18.988 8.80058 18.2379 7.93751 17.7746 7.41354C16.8318 6.43019 15.7032 5.6247 14.422 4.97297C12.9302 4.24913 11.274 3.83493 9.5 3.80835ZM9.4988 5.22144C11.9707 5.22144 13.9745 7.13718 13.9745 9.50042C13.9745 11.8636 11.9707 13.7794 9.4988 13.7794C7.02691 13.7794 5.02311 11.8636 5.02311 9.50042C5.02311 7.13718 7.02691 5.22144 9.4988 5.22144Z"
                  fill="#B8E986"
                />
              </svg>
            </span>
            <span class="actionType">See</span>
          </li>
          <li          
            @click="selectedAction('click')"
          >
            <span>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.14582 7.79167L12.665 11.5954L12.0417 11.7229L11.5883 11.8079C11.1421 11.9 10.8871 12.3958 11.0854 12.7996L11.2767 13.2104L12.24 15.2929L11.2342 15.7604L10.2708 13.685L10.0867 13.2742C10.0428 13.1766 9.9771 13.0905 9.89465 13.0224C9.8122 12.9543 9.7152 12.9061 9.61114 12.8814C9.50709 12.8568 9.39876 12.8564 9.29452 12.8803C9.19029 12.9042 9.09294 12.9517 9.00999 13.0192L8.64874 13.3025L8.14582 13.7062V7.79167ZM7.62166 6.15542C7.47888 6.15542 7.34195 6.21213 7.241 6.31309C7.14004 6.41405 7.08332 6.55097 7.08332 6.69375V14.8042C7.08332 15.1017 7.32416 15.3425 7.62166 15.3425C7.75624 15.3425 7.86957 15.3 7.96166 15.2292L9.31457 14.1313L10.4904 16.6954C10.5825 16.8867 10.7737 17 10.9792 17C11.0571 17 11.135 17 11.2129 16.9433L13.1679 16.0367C13.4371 15.9092 13.5646 15.5833 13.4229 15.3212L12.24 12.75L13.9471 12.4312C14.0643 12.4008 14.1702 12.3368 14.2517 12.2471C14.4429 12.0204 14.4146 11.6875 14.1667 11.4821L7.97582 6.27583L7.96874 6.28292C7.87185 6.20055 7.74882 6.15536 7.62166 6.15542V6.15542ZM10.625 7.08333V5.66667H14.1667V7.08333H10.625ZM9.79624 3.37167L11.8008 1.36708L12.7996 2.36583L10.795 4.37042L9.79624 3.37167ZM7.08332 0H8.49999V3.54167H7.08332V0ZM2.78374 10.3842L4.78832 8.37958L5.78707 9.37833L3.78249 11.3829L2.78374 10.3842V10.3842ZM2.78374 2.36583L3.78249 1.36708L5.78707 3.37167L4.78832 4.37042L2.78374 2.36583ZM4.95832 7.08333H1.41666V5.66667H4.95832V7.08333Z"
                  fill="#F5A623"
                />
              </svg>
            </span>
            <span class="actionType">Click</span>
          </li>
          <li          
            @click="selectedAction('fillField')"
          >
            <span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.875 2.49976H2.5C2.16848 2.49976 1.85054 2.63145 1.61612 2.86587C1.3817 3.10029 1.25 3.41824 1.25 3.74976V12.4998C1.25 12.8313 1.3817 13.1492 1.61612 13.3836C1.85054 13.6181 2.16848 13.7498 2.5 13.7498H11.25C11.5815 13.7498 11.8995 13.6181 12.1339 13.3836C12.3683 13.1492 12.5 12.8313 12.5 12.4998V8.12476"
                  stroke="#4A90E2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.5625 1.5624C11.8111 1.31376 12.1484 1.17407 12.5 1.17407C12.8516 1.17407 13.1889 1.31376 13.4375 1.5624C13.6861 1.81104 13.8258 2.14827 13.8258 2.4999C13.8258 2.85153 13.6861 3.18876 13.4375 3.4374L7.5 9.3749L5 9.9999L5.625 7.4999L11.5625 1.5624Z"
                  stroke="#4A90E2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="actionType">Fill</span>
          </li>
        </ul>
      </div>

      <div class="InteractiveShell-actions columns">
        <div class="column">
          <b-button
            @click="toggleSteps()"
            type="is-secondary"
          >
            Successful Steps {{ successfulSteps.length }}
          </b-button>        
        </div>

        <div
          class="column"
          v-if="showNextStep"
        >
          <b-button
            @click.once="nextStep()"
            type="is-primary"
            outlined
          >
            Next Step
          </b-button>
        </div>
        <div class="column text-right">
          <b-button
            @click.once="closeInteractiveShell()"
            type="is-primary"
          >
            Exit
          </b-button>
        </div>
      </div>
      <div 
        v-if="command && commandDoc !== null" 
        v-show="showDoc"
        class="action-documentation"
      >
        <h4># {{ command.replace(/\(.*/,'') }} </h4>
        <div class="action-def">
          {{ commandDoc.actionDef }}
        </div>
        <pre v-highlightjs="commandDoc.actionExample"><code class="javascript" /></pre>
      </div>
    </div>
  </div>
</template>

<script>
import Convert from 'ansi-to-html';
import copyToClipboard from 'copy-text-to-clipboard';

export default {
  name: 'Pause',
  props: {
    showNextStep: {
      type: Boolean,
      default: false,
    }
  },
  components: {
  },
  data: function() {
    return {
      command: '',
      params: {},
      history: [],
      showSuccessfulSteps: false,
      cursor: 0,
      commandDoc: null,
      showDoc: true,
    };
  },
  created: async function() {
    this.$store.dispatch('cli/startCli');
    await this.$store.dispatch('cli/loadActions');
    setTimeout(() => this.$refs['commands'] && this.$refs['commands'].focus(), 100);
  },
  mounted: function() {
    this.$refs['commands'] && this.$refs['commands'].focus();
    setTimeout(() => this.$refs['commands'] && this.$refs['commands'].focus(), 100);
  },
  computed: {

    filteredActions() {
      const actionArray = ['see','click','fill','wait','grab'];
      const actions = this.$store.getters['cli/actions'];
      return Object.keys(actions)
        .filter(action => action.startsWith(this.command))
        .sort((a, b) => a.length - b.length)
        .map(action => {
          if (!actions[action]) {
            return {
              action,
              suggection: `${action}()`,
            };
          }
          let actionType = actionArray.filter(actionType => action.toLowerCase().startsWith(actionType));
          let actionTypeText = actionType[0] || '';
          return {
            action, suggestion: `${action}(${actions[action].params.args})`, actionType: actionTypeText, actionDoc: actions[action].actionDoc
          };
        });
    },
    successfulSteps() {
      return this.$store.getters['cli/steps'];
    },
    stepsCode() {
      return this.$store.getters['cli/steps'].map(step => {
        if (step.command) return step.command + ';';
        return `${step.actor}.${step.name}(${JSON.stringify(step.args).slice(1, -1)});`;
      }).join('\n');
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
    copy(text) {
      copyToClipboard(text);
    },
    selectedAction(actionText) {
      const actions = this.$store.getters['cli/actions'];
      const action = actions[actionText];
      action.action = actionText;
      this.selectAction(action);
    },
    selectAction(action) {
      if (!action) return;
      if(action.actionDoc !== null && action.actionDoc !== undefined) {
        let [actionDef, actionExample] = action.actionDoc.split('```js');
        actionExample = actionExample.replace('```',' ');
        this.commandDoc = { actionDef, actionExample };
      }
      if (!action || typeof action !== 'object') return false;
      this.$refs['commands'].setSelected(action.action + '("")');
      setTimeout(() => {
        const input = this.$refs['commands'].$el.getElementsByTagName('input')[0];
        const pos = action.action.length+2;
        input.focus();
        input.setSelectionRange(pos, pos);
        input.focus();
      }, 0);
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
    toggleSteps() {
      this.showSuccessfulSteps = true;
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
      this.showSuccessfulSteps = true;
    },
    nextStep() {
      this.$socket.emit('cli.line', '');
    },

  }
};
</script>

<style lang="scss" scoped>
  .actionDoc {
    background: rgba(0,0,0,0.02);
    font-size:12px;
    margin-bottom: 12px;
    padding: 4px;
  }
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
  .interactiveBox {
    position: relative;
    @apply my-2;
    .show-doc {
      position: absolute;
      right: 0;
    }
    .cmd {
      margin: -0.375rem -1rem;
      margin-right: -3rem;
      padding: 0.375rem 1rem;
      white-space: normal;
      background: rgba(0, 0, 0, 0.02);
    }
    .cmd.see {
      background: rgba(184, 233, 134, 0.2);
      border-bottom: rgba(184, 233, 134, 0.8);
    }
    .cmd.click {
      background: rgba(245, 166, 35, 0.2);
      border-bottom: rgba(245, 166, 35, 0.8);
    }
    .cmd.fill {
      background: rgba(74, 144, 226, 0.2);
      border-bottom: rgba(74, 144, 226, 0.8);
    }
    .cmd.wait {
      background: rgba(226, 98, 98, 0.1);
      border-bottom: rgba(226, 98, 98, 0.8);
    }
    .cmd.grab {
      background: rgba(189, 16, 224, 0.04);
      border-bottom: rgba(189, 16, 224, 0.8);
    }
    .interactiveOptions {

      // position: absolute;
      // margin: 0;
      // top: 40px;
      // z-index: 20;
      // width: 100%;
      @apply flex;
      li {
        @apply flex-1;
        cursor: pointer;
        padding: 0;
        text-align: center;
      }
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .actionType {
        margin-left: 6px;
      }
    }
  }
  .action-documentation {
      border: 1px solid #feebc8;
      background: #ffffff;
      padding: 12px;
      box-shadow: 0 0 4px 2px rgba(0,0,0,0.02);
      h4 {
        margin-bottom: 10px;
        font-size: 1.2em;
        color: #6f42c1;
      }
      .action-def {
        margin-bottom: 12px;
      }
    }
</style>
<style lang="scss">
  .InteractiveShell {
    @apply border-yellow-400 mt-1 border-t-4;
  }
  .commandInput {
    .input {
      height: 44px;
    }
  }
</style>
