<template>
    <div class="SeeStep">
        <span class="Step-restMethod">
          {{httpMethod}}
        </span>
        <span class="Step-restUrl">
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

      if (step.name.includes('sendGet')) {
        return 'get';
      }
      if (step.name.includes('sendPut')) {
        return 'put';
      }
      if (step.name.includes('sendPost')) {
        return 'post';
      }
      if (step.name.includes('sendDelete')) {
        return 'delete';
      }
      return 'unknown';
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
.SeeStep {
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
  color: blue;
  width: 4em;
  text-transform: uppercase;
}

.Step-restUrl {
  color: hsl(0, 0%, 71%);
}

</style>

