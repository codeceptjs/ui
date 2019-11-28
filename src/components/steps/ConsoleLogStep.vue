<template>
  <div
    class="ConsoleLogStep is-gapless"
    :class="{ error: step.logEntry.type === 'error' }"
  >
    <b>console.{{ step.logEntry.type }}</b>
    {{ step.logEntry.args }}
  </div>
</template>

<script>
export default {
  name: 'ConsoleLogStep',
  props: {
    step: {
      type: Object,
      required: true,
    }
  },
};
</script>

<style lang="scss">
.ConsoleLogStep {

    @apply bg-yellow-200;
    &.error {
        @apply bg-red-200;
    }

}
</style>


