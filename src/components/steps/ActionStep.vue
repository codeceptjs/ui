<template>
  <span>
    I {{step.humanized}} 
    <span class="arguments">
    <Argument v-for="arg of step.args" v-bind:key="arg.toString()" v-bind:arg="arg" ></Argument>
  </span>

  </span>
</template>

<script>
import Argument from './Argument';

export default {
    name: 'ActionStep',
    props: ['step'],
    components: { Argument },
}
</script>

<style>


</style>


