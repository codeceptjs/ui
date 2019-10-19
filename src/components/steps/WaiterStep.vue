<template>
  <div class="step wait">
    <i class="far fa-hourglass"></i>{{formatStep(step.humanized)}} 
    <span v-for="arg of step.args" v-bind:key="arg" class="argument">
      {{ arg }} 
    </span>
  </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'WaiterStep',
    props: ['step'],
    methods: {      
      formatSelector(sel) {
        return getSelectorString(sel).label;
      },
      formatStep(stepName) {
        return stepName.replace(/^wait /, '').replace(/^for /, '');
      }
    }
}
</script>

<style>
</style>


