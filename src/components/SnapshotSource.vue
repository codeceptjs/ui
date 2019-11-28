<template>
  <div class="SnapshotSource">
    <div class="SnapshotSource-content has-background-grey-lighter">
      <iframe
        ref="source"
        id="source"
        :src="buildSnapshotUrl(snapshotId)"
        :key="'codepress-iframe-'+buildSnapshotUrl(snapshotId)"
        :width="viewportSize.width"
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
    snapshotId: {
      type: Number,
      required: true,
    },
    snapshotScrollPosition: {
      type: Number,
      required: true,
    },
    viewportSize: {
      type: Number,
      required: true,
    },
    highlight: {
      type: Boolean,
      required: true,
    },
    enabledSelection: {
      type: Boolean,
      required: true,
    },
  },
  data: function() {
    return {
      loaded: false
    };
  },
  methods: {
    buildSnapshotUrl(snapshotId) {
      return `/api/snapshots/html/${snapshotId}`;
    },

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
      return (
        this.$refs.source.contentWindow &&
        (this.$props.snapshotScrollPosition.x > 0 ||
        this.$props.snapshotScrollPosition.y > 0)
      );
    },

    onIframeLoaded() {
      this.loaded = true;
      if (this.mustScrollIframe()) {
        // Only page to vertical position
        this.$refs.source.contentWindow.scrollTo(
          0,
          this.$props.snapshotScrollPosition.y
        );
      }
      highlightInIframe(
        this.getIframeDoc(),
        this.getIframeWindow(),
        this.$props.highlight
      );

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


