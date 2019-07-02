<template>
  <div class="Snapshot" v-if="selected.snapshot">
    
    <div class="Snapshot-actions">
      <b-button type="is-primary" outlined v-on:click="toggleShowScreenshot()">
        Screenshot/Source
      </b-button>
    </div>

    <div class="Snapshot-pageUrl">
      <a :href="selected.snapshot.pageUrl">{{selected.snapshot.pageTitle}}</a>
      <input class="input is-rounded" type="text" :placeholder="selected.snapshot.pageUrl">
    </div>

    <div class="Snapshot-data" v-if="selected.snapshot">
      <img v-if="showScreenshot" 
        class="Snapshot-image"
        :src="toDataUri(selected.snapshot.screenshot)" 
        :alt="selected.name"
      >

      <snapshot-source 
        v-if="!showScreenshot"
        v-bind:pageUrl="selected.snapshot.pageUrl"
        v-bind:source="selected.snapshot.source"
        v-bind:sourceContentType="selected.snapshot.sourceContentType"
      />
    </div>

  </div>
</template>

<script>
import SnapshotSource from './SnapshotSource'

function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const getAndroidBoundedElements = (source, contentType) => {
  if (contentType !== 'xml') {
    return;
  }

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
  components: {
    SnapshotSource
  },
  props: ['selected'],
  methods: {
    toDataUri(buf) {
      return `data:image/png;base64,` + arrayBufferToBase64(buf);
    },

    toggleShowScreenshot() {
      this.showScreenshot = !this.showScreenshot;
      // console.log(getAndroidBoundedElements(this.$props.selected.snapshot.source, this.$props.selected.snapshot.sourceContentType));
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

.Snapshot-actions {
  margin: 0 auto;
  margin-bottom: 1em;
  width: 200px;
}

.Snapshot-data {
}

.Snapshot-pageUrl {
  margin-bottom: .5em;
}

.Snapshot-image {
  min-width: 480px;
  max-width: 100%;
}

</style>
