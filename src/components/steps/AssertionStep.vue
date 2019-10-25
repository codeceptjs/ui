<template>
  <span>
    <i class="far fa-eye" v-if="!isNegative(step.name)"></i>
    <i class="far fa-eye-slash" v-if="isNegative(step.name)"></i>

    {{formatStep(step.humanized)}} 

    <span class="arguments">
    <Argument v-for="arg of step.args" v-bind:key="arg.toString()" v-bind:arg="arg" ></Argument>      
    </span>
  </span>
</template>

<script>
import Argument from './Argument';

export default {
    name: 'AssertionStep',
    props: ['step'],
    components: { Argument },
    methods: {      
      isNegative(stepName) {
        return stepName.startsWith('dontSee')
      },
      formatStep(stepName) {
        return stepName.replace(/^(see|dont see)/, '');
      }
    }
}
</script>

<style>
</style>


