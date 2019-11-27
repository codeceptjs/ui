<template>
  <div class="mb-2 mt-2">
    <b-message
      size="is-small"
      :title="'Test pailed in ' + test.duration + 's'"
      type="is-danger"
      aria-close-label="Close message"
      v-if="test.result === 'failed'"
    >
      {{ trim(test.error.message) }}
    </b-message>
    <b-message
      size="is-small"
      :title="'Test passed in ' + test.duration + 's'"
      type="is-success"
      aria-close-label="Close message"
      v-if="test.result === 'passed'"
    />
  </div>
</template>

<script>
export default {
  name: 'TestResult',
  props: {
    test: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    trim(str) {
      return str.trim();
    },
  }
};
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

</style>
