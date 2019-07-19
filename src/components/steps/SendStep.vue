<template>
    <div class="SendStep">
        <span class="Step-restMethod has-text-info">
          {{httpMethod}}
        </span>
        <span class="Step-restDuration has-text-grey-light">{{step.duration}}</span>
        <span class="Step-restUrl has-text-grey">
          {{urlRearPart}}
        </span>
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
      url = new URL(url);

      return url.pathname;
    },
  },

}
</script>
<style>
.SendStep {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.Step-restMethod {
  display: inline-block;
  border-radius: 2px;
  width: 4em;
  text-transform: uppercase;
}

.Step-restUrl {
}

.Step-restDuration {
  display: inline-block;
  width: 3em;
}

</style>

