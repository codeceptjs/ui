<template>
  <div class="Step"
    v-bind:class="{ 'Step--selected': isSelected, 'Step--failed': step.result === 'failed', 'Step--passed': step.result === 'passed' }"
    v-on:click="$emit('select-step', step)">
    <div class="Step-name">

      I {{step.humanized}}
    </div>

    <div class="Step-args">
      {{step.args[0]}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  props: ['step', 'selectedStep', 'isSelected', 'error'],
}
</script>

<style scoped>
.Step {
  padding: 5px;
  cursor: pointer;
  margin-top: .2em;
  color: #4f5959;
}

.Step-name {
  font-size: 0.9em;
  font-weight: bold;
}

.Step-args {
  font-size: 0.8em;
  margin-left: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.Step--selected {
  background-color: #ddd;
}

.Step--passed {
  border-left: 3px solid hsl(141, 71%, 48%);
}

.Step--failed {
  border-left: 3px solid hsl(348, 100%, 61%);
}
</style>
