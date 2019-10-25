<template>
  <span>

    {{step.humanized}}

    <Argument v-for="arg of step.args" v-bind:key="arg.toString()" v-bind:arg="arg" ></Argument>      
    
     
     <div>
    <i class="fas fa-hand-holding"></i>
        <b> {{step.returnValue}}</b>
     </div>
  </span>
</template>

<script>
import {getSelectorString} from '../../services/selector';
import Argument from './Argument';

export default {
    name: 'GrabberStep',
    props: ['step'],
    components: { Argument },    
    methods: {      
      formatSelector(sel) {
        return getSelectorString(sel).label;
      },
    }
}
</script>

<style>
</style>


