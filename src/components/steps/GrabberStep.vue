<template>
  <div class="step grab">

    {{step.humanized}}


    <span v-for="arg of step.args" v-bind:key="arg" class="argument">
      {{ formatSelector(arg) }} 
    </span>
     
     <div>
    <i class="fas fa-hand-holding"></i>
        <b> {{step.returnValue}}</b>
     </div>
  </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'GrabberStep',
    props: ['step'],
    methods: {      
      formatSelector(sel) {
        return getSelectorString(sel).label;
      },
    }
}
</script>

<style>
</style>


