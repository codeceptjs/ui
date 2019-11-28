<template>
  <span>
    <i
      class="far fa-eye"
      v-if="!isNegative(step.name)"
    />
    <i
      class="far fa-eye-slash"
      v-if="isNegative(step.name)"
    />

    {{ formatStep(step.humanized) }}

    <span class="arguments">
      <Argument
        v-for="arg of step.args"
        :key="arg.toString()"
        :arg="arg"
      />
    </span>
  </span>
</template>

<script>
import Argument from './Argument';

export default {
  name: 'AssertionStep',
  props: {
    step: {
      type: Object,
      required: true,
    }
  },
  components: { Argument },
  methods: {
    isNegative(stepName) {
      return stepName.startsWith('dontSee');
    },
    formatStep(stepName) {
      return stepName.replace(/^(see|dont see)/, '');
    }
  }
};
</script>

<style>
</style>


