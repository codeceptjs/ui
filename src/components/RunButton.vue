<template>
  <div>
    <button
      class="button is-primary px-8 py-2 is-outlined"
      @click="runOrStop()"
      @mouseover="isRunning && canStop(true)"
      @mouseout="isRunning && canStop(false)"
      :disabled="disabled"
    >
      <span v-if="!isRunning">
        <i class="fas mr-2 fa-play " />
        Run
      </span>
      <span v-if="isRunning">
        <span v-if="canBeStopped">
          <i class="fas mr-2 fa-stop" />
          Stop
        </span>
        <span v-else-if="isPaused">
          <i class="fas mr-2 fa-pause" />
          Paused
        </span>
        <span v-else>
          <i class="fas fa-circle-notch fa-spin" />
          Running
        </span>
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'RunButton',
  data() {
    return {
      canBeStopped: false,
      disabled: false,
    };
  },
  computed: {
    isRunning() {
      return this.$store.getters['testRuns/isRunning'];
    },
    isPaused() {
      return this.$store.getters['cli/show'];
    }
  },
  methods: {
    canStop(val) {
      this.canBeStopped = val;
    },
    runOrStop() {
      if (this.isRunning) {
        return this.stop();
      }
      this.run();
    },
    run() {
      this.$emit('run');
    },
    stop() {
      this.$socket.emit('cli.line', 'exit');
      this.$store.commit('cli/stopCli');
      this.$store.dispatch('testRuns/stop');
      this.disabled = true;
      setTimeout(() => {
        this.canBeStopped = false;
        this.disabled = false;
      }, 3000); // wait for 3 secs to stop
    },

  }
};
</script>
<style lang="scss" scoped>
  button {
    @apply px-8;
  }
</style>
