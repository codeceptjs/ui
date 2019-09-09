<template>
    <div class="SendStep columns is-gapless has-text-grey-light">
      <div class="column is-3">
        <span class="Step-restMethod has-text-dark is-italic">
          {{httpMethod}}
        </span>
      </div>
      <div class="column is-9">
        <span class="Step-restUrl">
          {{urlRearPart}}
        </span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'SendStep',
  props: ['step'],
  computed: {
    httpMethod: function () {
      const step = this.$props.step;
      return step.name
        .replace('send', '').replace('Request', '')
        .toLowerCase();
    },

    urlRearPart: function () {
      const step = this.$props.step;
      let url = step.args[0];
      if (!url) return;
      if (!url.startsWith('http')) return url;

      url = new URL(url);
      return url.pathname;
    },
  },

}
</script>
<style>
.SendStep {
}

.Step-restMethod {
  display: inline-block;
  border-radius: 2px;
  width: 4em;
  text-transform: uppercase;
}

.Step-restUrl {
}

</style>

