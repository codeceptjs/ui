<template>
  <span class="CapabilityFolder has-text-grey">
    <i class="far fa-folder-open" />
        &nbsp;
    <span
      v-for="p in splitPath(folder)"
      :key="p"
    >
      <span class="has-text-grey-lighter">/</span> {{ p }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'CapabilityFolder',
  props: {
    folder: {
      type: ArrayBuffer,
      required: true,
    },
  },
  methods: {
    splitPath(p) {
      return p.split('/').slice(1);
    }
  }
};
</script>
<style>
.CapabilityFolder {
}

.CapabilityFolder span:last-child {
    font-weight: bold;
}
</style>
