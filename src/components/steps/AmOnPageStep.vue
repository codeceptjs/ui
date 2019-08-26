<template>
    <div class="AmOnPageStep columns is-gapless">
      <div class="column is-3">
        I {{step.humanized}}
      </div>
      <div class="column is-9">
        <span class="AmOnPageStep-url ellipsize">
          {{extractPathname(step.args[0])}}
        </span>
      </div>
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
}

.AmOnPageStep-url {
  color: hsl(204, 86%, 53%);
}

</style>


