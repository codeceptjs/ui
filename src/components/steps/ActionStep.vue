<template>
  <div class="step">
    I {{step.humanized}} 
    <span v-for="arg of step.args" v-bind:key="arg" class="argument">
      {{ arg }}
    </span>
  </div>
</template>

<script>
export default {
    name: 'ActionStep',
    props: ['step'],
    methods: {
      extractPathname(urlAsString) {
        const url = new URL(urlAsString);
        return url.pathname;
      }
    }
}
</script>

<style>
.AmOnPageStep {
}


</style>


