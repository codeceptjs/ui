<template>
    <div class="SnapshotSource">
        <iframe id="source" :src="buildSnapshotUrl(stepId)" frameborder="0"></iframe>
    </div>
</template>

<script>

const highlightInIframe = (iframeId, sel) => {
    const iframe = document.getElementById(iframeId);
    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;

    const els = innerDoc.querySelectorAll(sel)
    if (els) {
        els.forEach(el => {
            el.style.transition = 'all .5s ease';
            el.style.border = '2px solid hsl(348, 100%, 61%)';
            el.style['border-radius'] = '2px';
        })
    }
}

export default {
    name: 'SnapshotSource',
    props: ['stepId', 'highlight'],
    methods: {
        buildSnapshotUrl(stepId) {
            return `/api/snapshots/html/${stepId}`;
        }
    },

    updated() {
        setTimeout(() => {
            highlightInIframe('source', this.$props.highlight);
        }, 500);
    }
}
</script>

<style>
.SnapshotSource {
  position: relative; 
  padding-bottom: 75%;
  height: 0; 
  overflow: hidden; 
  width: 100%;
  height: auto;    
}

#source {
    position: absolute;
    top: 0;
    left: 0;
    height: 90%;
    width: 100%;
    border: none;
}
</style>


