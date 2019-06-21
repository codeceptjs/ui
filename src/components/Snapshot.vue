<template>
  <div class="Snapshot" v-if="selected.snapshot">
    <div class="Actions">
      <b-button type="is-primary" outlined v-on:click="toggleShowScreenshot()">
        Screenshot/Source
      </b-button>
    </div>
    <div>
      <a :href="selected.pageUrl">{{selected.pageTitle}}</a>
    </div>
    <div v-if="selected.snapshot">
      <img v-if="showScreenshot" width="480" :src="toDataUri(selected.snapshot.screenshot)" :alt="selected.name">
      <code v-if="!showScreenshot">
        <pre>
          {{selected.snapshot.source}}
        </pre>
      </code>
    </div>
  </div>
</template>

<script>
function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const getAndroidBoundedElements = source => {
  const oParser = new DOMParser();
  const oDOM = oParser.parseFromString(source, "application/xml");

  let els = [];
  const query = oDOM.evaluate('//*[@bounds]', oDOM, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    els.push(query.snapshotItem(i));
  }
  return els;
}

export default {
  name: 'Snapshot',
  props: ['selected'],
  methods: {
    toDataUri(buf) {
      return `data:image/png;base64,` + arrayBufferToBase64(buf);
    },

    toggleShowScreenshot() {
      this.showScreenshot = !this.showScreenshot;

      console.log(getAndroidBoundedElements(this.$props.selected.snapshot.source));
    }
  },
  data: function () {
    return {
      showScreenshot: true,
    }
  }
}
</script>

<style scoped>
.Step {
  margin-top: 1em;
  color: #4f5959;
}
</style>
