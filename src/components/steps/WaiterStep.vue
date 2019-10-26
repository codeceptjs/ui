<template>
  <span>
    <i class="far fa-hourglass"></i>{{formatStep(step.humanized)}} 
    <span class="arguments">
      <Argument v-for="arg of step.args" v-bind:key="arg.toString()" v-bind:arg="arg" ></Argument>      
    </span>
  </span>
</template>

<script>
import Argument from './Argument';

export default {
    name: 'WaiterStep',
    props: ['step'],
    components: { Argument },
    methods: {      
      formatStep(stepName) {
        return stepName.replace(/^wait /, '').replace(/^for /, '');
      }
    }
}
</script>

<style>
</style>


