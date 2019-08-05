<template>
  <div class="Snapshot">
    
    <div class="Snapshot-browser" v-if="!isCodeStep(selected) && selected.snapshot">

      <div class="Snapshot-actions" v-if="selected.snapshot">
        <div class="buttons has-addons">
          <span class="button is-small" :disabled="!selected.snapshot.hasScreenshot" v-bind:class="{ 'is-info is-selected': isShowImage }" v-on:click="showImage()">
            <i class="far fa-image"></i>
          </span>
          <span class="button is-small" :disabled="!selected.snapshot.hasSource" v-bind:class="{'is-info is-selected': isShowSource }" v-on:click="showSource()">
            <i class="far fa-file-code"></i>
          </span>
        </div>
      </div>

      <div class="Snapshot-pageTitle">
        <a :href="selected.snapshot.pageUrl" target="_blank">
          <span class="Snapshot-size is-pulled-right">
            <i class="fas fa-desktop"></i> {{selected.snapshot.viewportSize.width}}x{{selected.snapshot.viewportSize.height}}
          </span>
          {{selected.snapshot.pageTitle}}
        </a>
      </div>
      <div class="Snapshot-pageUrl has-text-grey has-background-grey-lighter">
        {{selected.snapshot.pageUrl}}
      </div>
      
      <div class="Snapshot-data" v-if="selected.snapshot">
        <img v-if="isShowImage" 
          class="Snapshot-image"
          :src="toImageUrl(selected.snapshot)" 
          :alt="selected.name"
        >

        <snapshot-source 
          v-if="isShowSource"
          v-bind:snapshotId="selected.snapshot.id"
          v-bind:snapshotScrollPosition="selected.snapshot.scrollPosition"
          v-bind:viewportSize="selected.snapshot.viewportSize"
          v-bind:highlight="getSelector(selected)"
        />
      </div>

    </div>

    <div class="Snapshot-code" v-if="selected.name.startsWith('send')">
      <h3 class="subtitle">
        <b>{{selected.name}}</b>
        <a :href="selected.args[0]" target="_blank">
          {{selected.args[0]}}
        </a>
      </h3>
      <pre v-if="isSendPostOrPut(selected)">
        <code>{{JSON.stringify(selected.args[1], null, 2)}}</code>
      </pre>
    </div>

  </div>
</template>

<script>
import {getSelectorString} from '../services/selector';
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
    toImageUrl(snapshot) {
      return `/api/snapshots/screenshot/${snapshot.id}`;
    },

    showImage() {
       this.$store.commit('setShowImage');
    },

    showSource() {
       this.$store.commit('setShowSource');
    },

    getSelector(step) {
      return getSelectorString(step.args[0]).value;
    },

    isCodeStep(step) {
      return step.name === 'comment' || step.name.startsWith('send');
    },

    isSendPostOrPut(step) {
      return ['sendPostRequest', 'sendPutRequest'].includes(step.name);
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

.Snapshot-pageTitle {
  margin-bottom: .5em;
}

.Snapshot-pageUrl {
  margin-bottom: .5em;
  border-radius: 3px;
  padding: 2px 1em;
}

.Snapshot-image {
  min-width: 480px;
  max-width: 100%;
}

.Snapshot-code {
  font-size: 0.8em;
}
</style>
