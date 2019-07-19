<template>
    <div class="AmOnPageStep">
      I {{step.humanized}} <span class="AmOnPageStep-url">{{extractPathname(step.args[0])}}</span>
    </div>
</template>

<script>
export default {
    name: 'AmOnPageStep',
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
  margin-top: .3em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.AmOnPageStep-url {
  color: hsl(204, 86%, 53%);
}

</style>


