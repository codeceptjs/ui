<template>
  <span>
    {{ step.humanized }}
    <Argument
      v-for="arg of step.args"
      :key="arg.toString()"
      :arg="arg"
    />
    <div>
      <i class="fas fa-hand-holding" />
      <b> {{ step.returnValue }}</b>
    </div>
  </span>
</template>

<script>
import {getSelectorString} from '../../services/selector';
import Argument from './Argument';

export default {
  name: 'GrabberStep',
  props: {
    step: {
      type: Object,
      required: true,
    }
  },
  components: { Argument },
  methods: {
    formatSelector(sel) {
      return getSelectorString(sel).label;
    },
  }
};
</script>

<style>
</style>


