<template>
    <div class="SnapshotSource">
        <!-- <div class="SnapshotSource-mouseInterceptor"></div> -->
        <iframe 
            ref="source"
            id="source" 
            :src="buildSnapshotUrl(snapshotId)" 
            :width="viewportSize.width" 
            frameborder="0"
            @load="onIframeLoaded"
            v-show="loaded"
        >
        </iframe>
    </div>
</template>

<script>

import  {
  highlightElement,
  dehighlightAll,
  highlightInIframe,
  findShortSelector,
} from '../services/selector-finder';
import copy from 'copy-text-to-clipboard';

const throttled = (delay, fn) => {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

const getIframeDoc = iframeId => {
    const iframe = document.getElementById(iframeId);
    if (!iframe) return;
    const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
    return {iframe, doc, contentWindow: iframe.contentWindow};
}

const handleIframeMouseMove = doc => throttled(200, e => {
    const el = doc.elementFromPoint(e.x, e.y);
    dehighlightAll(doc);
    highlightElement(el);
})

const handleIframeMouseOut = (doc, highlight) => throttled(50, () => {
    dehighlightAll(doc);
    highlightInIframe(doc, highlight); // highlight step locator again
})

const handleIframeClick = (doc, highlight) => throttled(10, (e) => {
    const el = doc.elementFromPoint(e.x, e.y);
    const shortestSelector = highlightElement(el);
    copy(shortestSelector);
})

export default {
    name: 'SnapshotSource',
    props: ['snapshotId', 'snapshotScrollPosition', 'viewportSize', 'highlight'],
    data: function() {
        return {
            loaded: false
        }
    },
    methods: {
        buildSnapshotUrl(snapshotId) {
            return `/api/snapshots/html/${snapshotId}`;
        },

        getIframeDoc() {
            return this.$refs.contentDocument || (this.$refs.source.contentWindow && this.$refs.source.contentWindow.document);
        },

        mustScrollIframe() {
            return this.$refs.source.contentWindow && (this.$props.snapshotScrollPosition.x > 0 || this.$props.snapshotScrollPosition.y > 0)
        },

        onIframeLoaded(e) {
            this.loaded = true;


            if (this.mustScrollIframe()) {
                this.$refs.source.contentWindow.scrollTo(this.$props.snapshotScrollPosition.x, this.$props.snapshotScrollPosition.y);
            }
            highlightInIframe(this.getIframeDoc(), this.$props.highlight);

            this.getIframeDoc().addEventListener('mousemove', handleIframeMouseMove(this.getIframeDoc()))
            this.getIframeDoc().addEventListener('mouseout', handleIframeMouseOut(this.getIframeDoc(), this.$props.highlight))
            this.getIframeDoc().addEventListener('click', handleIframeClick(this.getIframeDoc(), this.$props.highlight))
        }
    },
}
</script>

<style>
.SnapshotSource {
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
    top: 0;
    left: 0;
    height: 90vh;
    max-width: 100%;
    border: none;
}
</style>


