<template>
  <div class="Test menu">
    <p class="menu-label">
      {{test.title}}
    </p>

    <ul class="menu-list">
      <li v-for="step in test.steps" v-bind:key="step.title">
        <step
          v-bind:step="step"
          v-bind:isSelected="step === selectedStep"
          v-on:select-step="$emit('select-step', step)"
        />
      </li>
    </ul>

    <div class="Cli box" v-if="isCliStarted">
      Interactive shell started
      <input 
        class="input" 
        type="text" 
        placeholder="I." 
        v-model="command"  
        v-on:keyup.enter="sendCommand(command)" />
    </div>

    <div v-if="test.error" class="Test-error">
      <b-message :title="test.error.name" type="is-danger">
        {{test.error.message}}
      </b-message>
    </div>

    <div class="Test-spacer"></div>
  </div>
</template>

<script>
import Step from './Step';

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
  sockets: {
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
    },
  },
  methods: {
    sendCommand(command) {
      this.$socket.emit('cli.line', command)
    }
  },
  computed: {
    isCliStarted() {
      return this.$store.state.cliStarted;
    }
  }
}
</script>

<style scoped>
.Test-spacer {
  height: 2em;
  width: 100%;
}
</style>
