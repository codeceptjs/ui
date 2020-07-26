<template>
  <div class="SnapshotSource">
    <div class="SnapshotSource-content has-background-grey-lighter">
      <iframe
        ref="source"
        id="source"
        :src="buildSnapshotUrl"
        :key="'codecept-iframe-'+snapshot.id"
        :width="snapshot.width || 1000"
        frameborder="0"
        @load="onIframeLoaded"
        v-show="loaded"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  </div>
</template>

<script>
import {
  dehighlightAll,
  highlightElement,
  highlightInIframe
} from '../services/selector-finder';
import copy from 'copy-text-to-clipboard';

const throttled = (delay, fn) => {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
};

const handleIframeMouseMove = (props, doc, window) =>
  throttled(200, e => {
    if (!props.enabledSelection) return;
    const el = doc.elementFromPoint(e.x, e.y);
    dehighlightAll(doc);
    highlightElement(el, doc, window);
  });

const handleIframeMouseOut = (props, doc, highlight) =>
  throttled(50, () => {
    if (!props.enabledSelection) return;
    dehighlightAll(doc);
    highlightInIframe(doc, highlight); // highlight step locator again
  });

const handleIframeClick = (props, doc, window) =>
  throttled(10, e => {
    if (!props.enabledSelection) return;
    const el = doc.elementFromPoint(e.x, e.y);
    const shortestSelector = highlightElement(el, doc, window);
    copy(shortestSelector);
  });

export default {
  name: 'SnapshotSource',
  props: {
    snapshot: {
      type: Object,
      required: true,
    },
    highlight: {
      type: String,
      required: false,
      default: '',
    },
    enabledSelection: {
      type: Boolean,
      required: false,
    },
  },
  data: function() {
    return {
      loaded: false
    };
  },
  computed: {
    buildSnapshotUrl() {
      return `/api/snapshots/html/${this.snapshot.id}`;
    },
  },
  methods: {

    getIframeDoc() {
      return (
        this.$refs.contentDocument ||
        (this.$refs.source.contentWindow &&
        this.$refs.source.contentWindow.document)
      );
    },

    getIframeWindow() {
      return this.$refs.source.contentWindow;
    },

    mustScrollIframe() {
      if (!this.$props.snapshot.scrollPosition) return false;
      return (        
        this.$refs.source.contentWindow &&
        (this.$props.snapshot.scrollPosition.x > 0 ||
        this.$props.snapshot.scrollPosition.y > 0)
      );
    },

    onIframeLoaded() {
      this.loaded = true;
      if (this.mustScrollIframe()) {
        // Only page to vertical position
        this.$refs.source.contentWindow.scrollTo(
          0,
          this.$props.snapshot.scrollPosition.y
        );
      }

      if (this.$props.highlight) {
        highlightInIframe(
          this.getIframeDoc(),
          this.getIframeWindow(),
          this.$props.highlight
        );
      }

      this.getIframeDoc().addEventListener(
        'mousemove',
        handleIframeMouseMove(this.$props, this.getIframeDoc(), this.getIframeWindow())
      );
      this.getIframeDoc().addEventListener(
        'mouseout',
        handleIframeMouseOut(this.$props, this.getIframeDoc(), this.$props.highlight)
      );
      this.getIframeDoc().addEventListener(
        'click',
        handleIframeClick(this.$props, this.getIframeDoc(), this.getIframeWindow(), this.$props.highlight)
      );
    }
  }
};
</script>

<style>
.SnapshotSource {
}

.SnapshotSource-content {
  position: relative;
  padding-bottom: 75%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  height: auto;
}

#source {
  cursor: pointer;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;

  height: 90%;
  max-width: 100%;
  border: none;

  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
</style>


