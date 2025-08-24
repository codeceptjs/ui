<template>
  <div class="Snapshot">
    <div
      class="Snapshot-browser"
      v-if="!isCodeStep(selected) && selected.snapshot"
    >
      <div class="columns Browser-header is-mobile">
        <div class="column">
          <div
            class="Snapshot-actions"
            v-if="selected.snapshot"
          >
            <div class="field ml-2 has-addons">
              <p class="control">
                <span
                  class="button is-small"
                  :disabled="!selected.snapshot.hasSnapshot"
                  :class="{'is-selected is-info': isShowSource }"
                  @click="showSource()"
                >
                  <i class="far fa-file-code" /> 
                  <span class="hide-on-small">Snapshot</span>
                  <span class="hide-on-wide">HTML</span>
                </span>
              </p>
              <p class="control">
                <span
                  class="button is-small"
                  :disabled="!selected.snapshot.hasScreenshot"
                  :class="{ 'is-selected is-info': isShowImage }"
                  @click="showImage()"
                >
                  <i class="far fa-image" /> 
                  <span class="hide-on-small">Screenshot</span>
                  <span class="hide-on-wide">IMG</span>
                </span>
              </p>
              <button
                :disabled="!isShowSource"
                class="button ml-2 is-small"
                :class="{ 'is-info': enabledSelection }"
                @click="toggleSelect"
                title="Element Selector Tool"
              >
                <i class="fas fa-mouse-pointer" />
              </button>
              <!-- Mobile snapshot toggle -->
              <button
                class="button ml-2 is-small hide-on-wide is-outlined"
                @click="toggleMobileView"
                title="Toggle Full View"
                v-if="isSmallScreen"
              >
                <i
                  class="fas fa-expand-alt"
                  v-if="!mobileFullView"
                />
                <i
                  class="fas fa-compress-alt"
                  v-if="mobileFullView"
                />
              </button>
            </div>
          </div>
        </div>
        <div class="column is-half hide-on-small">
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

        <div class="column hide-on-small">
          <span class="Snapshot-size is-pulled-right">
            <b-tag><i class="fas fa-file-code" />{{ selected.snapshot.sourceContentType }}</b-tag>&nbsp;
            <b-tag v-if="selected.snapshot.height"><i class="fas fa-desktop" /> {{ selected.snapshot.width }}x{{ selected.snapshot.height }}</b-tag>&nbsp;

          </span>
        </div>
      </div>

      <!-- Mobile page info -->
      <div
        class="mobile-page-info hide-on-wide"
        v-if="selected.snapshot.pageUrl"
      >
        <div class="text-sm text-gray-700 p-2 bg-gray-100">
          <div class="font-bold">
            {{ selected.snapshot.pageTitle }}
          </div>
          <div class="text-xs text-gray-600 truncate">
            {{ selected.snapshot.pageUrl }}
          </div>
        </div>
      </div>

      <div
        class="Snapshot-data"
        v-if="selected.snapshot"
        :class="{ 'mobile-full-view': mobileFullView }"
      >
        <div v-if="isShowImage">
          <img
            v-if="selected.snapshot.hasScreenshot"
            class="Snapshot-image"
            :src="toImageUrl(selected.snapshot)"
            :alt="selected.name"
          >

          <div
            class="empty"
            v-if="!selected.snapshot.hasScreenshot"
          >
            No screenshot for this step
          </div>
        </div>

        <snapshot-source
          v-if="isShowSource && selected && selected.snapshot && selected.snapshot.id"
          :snapshot="selected.snapshot"
          :highlight="getSelector(selected)"
          :enabled-selection="enabledSelection"
        />

        <div
          class="empty"
          v-if="isShowSource && selected && !selected.snapshot && !selected.snapshot.id"
        >
          No snapshot for this step
        </div>
      </div>
      <div
        class="empty"
        v-else
      >
        No snapshot for this step
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
      if (!this.selected.snapshot.hasScreenshot) return false;
      this.$store.commit('testRunPage/setShowImage');
    },

    showSource() {
      if (!this.selected.snapshot.hasSnapshot) return false;
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
    },
    
    toggleMobileView() {
      this.mobileFullView = !this.mobileFullView;
    },
    
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth <= 1024;
      if (!this.isSmallScreen) {
        this.mobileFullView = false;
      }
    }
  },
  data: function () {
    return {
      show: 'image',
      enabledSelection: false,
      mobileFullView: false,
      isSmallScreen: false,
    };
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
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
  
  @media (max-width: 1024px) {
    width: 100%;
    margin-bottom: 0.5em;
  }
}

.Snapshot-data {
  overflow-x: auto;
  
  &.mobile-full-view {
    position: fixed;
    top: 3.25rem;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: white;
    overflow-y: auto;
    padding: 1rem;
    
    @media (min-width: 1024px) {
      position: static;
      top: auto;
      left: auto;
      right: auto;
      bottom: auto;
      z-index: auto;
      background: transparent;
      overflow-y: visible;
      padding: 0;
    }
  }
}

.Snapshot-pageTitle {
}

.Snapshot-pageUrl {
  border-radius: 3px;
  padding: 2px 1em;
}

.Snapshot-image {
  min-width: 320px;
  max-width: 100%;
  height: auto;
  
  @media (max-width: 1024px) {
    min-width: 100%;
    width: 100%;
  }
}

.mobile-page-info {
  border-bottom: 1px solid #e5e5e5;
}

/* Responsive button text */
@media (max-width: 480px) {
  .Snapshot-actions .button {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .Snapshot-actions .field {
    margin-left: 0;
  }
}
</style>
