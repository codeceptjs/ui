<template>
    <div class="SnapshotSource">
        <iframe id="source" :src="toDataUri(pageUrl, source, sourceContentType)" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    name: 'SnapshotSource',
    props: ['pageUrl', 'source', 'sourceContentType'],
    methods: {
        toDataUri(pageUrl, source) {
            const url = new URL(pageUrl);
            let processedSource = source
            processedSource = source.replace(/href="\/\//g, `href="https://`);
            processedSource = processedSource.replace(/href="\//g, `href="https://${url.hostname}/`);
            return `data:text/html;charset=iso-8859-1,` + escape(processedSource);
        }
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


