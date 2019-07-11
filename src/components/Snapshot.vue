<template>
  <div class="Snapshot" v-if="selected.snapshot">
    
    <div class="Snapshot-actions" v-if="selected.snapshot">
      <div class="buttons has-addons">
        <span class="button" v-if="selected.snapshot.screenshot" v-bind:class="{ 'is-info is-selected': isShowImage }" v-on:click="showImage()">
          <i class="far fa-image"></i>
        </span>
        <span class="button" v-if="selected.snapshot.source" v-bind:class="{ 'is-info is-selected': isShowSource }" v-on:click="showSource()">
          <i class="far fa-file-code"></i>
        </span>
      </div>
    </div>

    <div class="Snapshot-pageUrl">
      <a :href="selected.snapshot.pageUrl">{{selected.snapshot.pageTitle}}</a>
      <input class="input is-rounded" type="text" :placeholder="selected.snapshot.pageUrl">
    </div>

    <div class="Snapshot-data" v-if="selected.snapshot">
      <img v-if="isShowImage" 
        class="Snapshot-image"
        :src="toDataUri(selected.snapshot.screenshot)" 
        :alt="selected.name"
      >

      <snapshot-source 
        v-if="isShowSource"
        v-bind:stepId="selected.id"
        v-bind:highlight="getSelector(selected)"
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

// const getAndroidBoundedElements = (source, contentType) => {
//   if (contentType !== 'xml') {
//     return;
//   }

//   const oParser = new DOMParser();
//   const oDOM = oParser.parseFromString(source, "application/xml");

//   let els = [];
//   const query = oDOM.evaluate('//*[@bounds]', oDOM, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//   for (let i = 0, length = query.snapshotLength; i < length; ++i) {
//     els.push(query.snapshotItem(i));
//   }
//   return els;
// }

export default {
  name: 'Snapshot',
  components: {
    SnapshotSource
  },
  props: ['selected'],
  methods: {
    // TODO Get screenshot image from api
    toDataUri(buf) {
      return `data:image/png;base64,` + arrayBufferToBase64(buf);
    },

    showImage() {
       this.$store.commit('setShowImage');
    },

    showSource() {
       this.$store.commit('setShowSource');
    },

    getSelector(step) {
      return step.args[0];
    }
  },
  data: function () {
    return {
      show: 'image',
    }
  },
  computed: {
    isShowImage() {
      return this.$store.state.show === 'image';
    },
    isShowSource() {
      return this.$store.state.show === 'source';
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
