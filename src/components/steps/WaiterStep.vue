<template>
  <span>
    <i class="far fa-hourglass" />{{ formatStep(step.humanized) }}
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
  name: 'WaiterStep',
  props: {
    step: {
      type: Object,
      required: true,
    }
  },
  components: { Argument },
  methods: {
    formatStep(stepName) {
      return stepName.replace(/^wait /, '').replace(/^for /, '');
    }
  }
};
</script>

<style>
</style>


