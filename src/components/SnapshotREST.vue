<template>
  <div
    class="SnapshotREST"
    v-if="step.name.startsWith('send')"
  >
    <h3 class="subtitle">
      <b>{{ step.name }}</b>
      <a
        :href="step.args[0]"
        target="_blank"
      >
        {{ step.args[0] }}
      </a>
    </h3>

    <div
      class="SnapshotREST-request"
      v-if="step.args[1]"
    >
      <h3>Request</h3>
      <pre>
          <code>{{ JSON.stringify(step.args[1], null, 2) }}</code>
        </pre>
    </div>

    <div
      class="SnapshotREST-response"
      v-if="step.returnValue"
    >
      <h3>Response</h3>
      <pre>
          <code>{{ JSON.stringify(step.returnValue, null, 2) }}</code>
        </pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SnapshotREST',
  props: {
    step: {
      type: Object,
      default: () => ({}),
    }
  },
  methods: {
    isSendPostOrPut(step) {
      return ['sendPostRequest', 'sendPutRequest'].includes(step.name);
    }
  }
};
</script>
<style>
.SnapshotREST {
  font-size: 0.8em;
}
</style>
