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

    <div v-if="test.error" class="Test-error">
      <b-message :title="test.error.name" type="is-danger">
        {{test.error.message}}
      </b-message>
    </div>

  </div>
</template>

<script>
import Step from './Step';

export default {
  name: 'Test',
  props: ['test', 'selectedStep'],
  components: {
    Step,
  }
}
</script>

<style scoped>

</style>
