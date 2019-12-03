<template>
  <div class="Snapshot">
    <div
      class="Snapshot-browser"
      v-if="!isCodeStep(selected) && selected.snapshot"
    >
      <div class="columns Browser-header">
        <div class="column">
          <div
            class="Snapshot-actions"
            v-if="selected.snapshot"
          >
            <div class="field ml-2 has-addons">
              <p class="control">
                <span
                  class="button is-small"
                  :disabled="!selected.snapshot.hasSource"
                  :class="{'is-selected is-info': isShowSource }"
                  @click="showSource()"
                >
                  <i class="far fa-file-code" /> Snapshot
                </span>
              </p>
              <p class="control">
                <span
                  class="button is-small"
                  :disabled="!selected.snapshot.hasScreenshot"
                  :class="{ 'is-selected is-info': isShowImage }"
                  @click="showImage()"
                >
                  <i class="far fa-image" /> Screenshot
                </span>
              </p>
              <button
                :disabled="!isShowSource"
                class="button ml-2 is-small"
                :class="{ 'is-info': enabledSelection }"
                @click="toggleSelect"
              >
                <i class="fas fa-mouse-pointer" />
              </button>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="Snapshot-pageUrl">
            <input
              class="input"
              type="text"
              placeholder="Disabled input"
              disabled
              :value="selected.snapshot.pageUrl"
            >
            <div class="text-center text-gray-800 text-xs">
              {{ selected.snapshot.pageTitle }}
            </div>
          </div>
        </div>

        <div class="column">
          <span class="Snapshot-size is-pulled-right">
            <b-tag><i class="fas fa-file-code" />{{ selected.snapshot.sourceContentType }}</b-tag>&nbsp;
            <b-tag><i class="fas fa-desktop" /> {{ selected.snapshot.viewportSize.width }}x{{ selected.snapshot.viewportSize.height }}</b-tag>&nbsp;

          </span>
        </div>
      </div>



      <div
        class="Snapshot-data"
        v-if="selected.snapshot"
      >
        <img
          v-if="isShowImage"
          class="Snapshot-image"
          :src="toImageUrl(selected.snapshot)"
          :alt="selected.name"
        >

        <snapshot-source
          v-if="isShowSource && selected && selected.snapshot"
          :snapshot="selected.snapshot"
          :highlight="getSelector(selected)"
          :enabled-selection="enabledSelection"
        />
      </div>
    </div>

    <SnapshotREST
      :step="selected"
      v-if="isREST"
    />
    <Console :step="selected" />
  </div>
</template>

<script>
import { getSelectorString } from '../services/selector';
import SnapshotSource from './SnapshotSource';
import SnapshotREST from './SnapshotREST';
import Console from './Console';

export default {
  name: 'Snapshot',
  components: {
    SnapshotSource,
    SnapshotREST,
    Console,
  },
  props: {
    selected: {
      type: Object,
      required: true,
    }
  },
  methods: {
    toImageUrl(snapshot) {
      return `/api/snapshots/screenshot/${snapshot.id}`;
    },

    showImage() {
      this.$store.commit('testRunPage/setShowImage');
    },

    showSource() {
      this.$store.commit('testRunPage/setShowSource');
    },

    getSelector(step) {
      return getSelectorString(step.args[0]).value;
    },

    isCodeStep(step) {
      if (!step.name) return false;
      return step.name === 'comment' || step.name.startsWith('send');
    },
    toggleSelect() {
      this.enabledSelection = !this.enabledSelection;
    }
  },
  data: function () {
    return {
      show: 'image',
      enabledSelection: false,
    };
  },
  computed: {
    isREST() {
      return this.selected.name && name.startsWith('send');
    },
    isShowImage() {
      return this.$store.getters['testRunPage/showImage'];
    },
    isShowSource() {
      return this.$store.getters['testRunPage/showSource'];
    }
  },

};
</script>

<style scoped>
.Snapshot {
  @apply bg-gray-100;
}

.Browser-header {
  /* @apply bg-gray-300; */
  @apply p-1 shadow-md;
}

.Snapshot-actions {
  margin: 0 auto;
  margin-bottom: 1em;
  width: 200px;
}

.Snapshot-data {
}

.Snapshot-pageTitle {
}

.Snapshot-pageUrl {
  border-radius: 3px;
  padding: 2px 1em;
}

.Snapshot-image {
  min-width: 480px;
  max-width: 100%;
}
</style>
