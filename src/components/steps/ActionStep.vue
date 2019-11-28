<template>
  <span>
    I {{ step.humanized }}
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
  name: 'ActionStep',
  props: {
    step: {
      type: Object,
      required: true,
    }
  },
  components: { Argument },
};
</script>

<style>


</style>


