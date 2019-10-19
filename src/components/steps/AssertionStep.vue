<template>
  <div class="step assert">

    <i class="far fa-eye" v-if="!isNegative(step.name)"></i>
    <i class="far fa-eye-slash" v-if="isNegative(step.name)"></i>

    {{formatStep(step.humanized)}} 

    <span v-for="arg of step.args" v-bind:key="arg" class="argument">
      {{ arg }} 
    </span>
  </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'AssertionStep',
    props: ['step'],
    methods: {      
      isNegative(stepName) {
        return stepName.startsWith('dontSee')
      },
      formatSelector(sel) {
        return getSelectorString(sel).label;
      },
      formatStep(stepName) {
        return stepName.replace(/^(see|dont see)/, '');
      }
    }
}
</script>

<style>
</style>


