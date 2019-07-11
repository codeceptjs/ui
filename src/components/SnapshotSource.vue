<template>
    <div class="SnapshotSource">
        <iframe id="source" :src="buildSnapshotUrl(stepId)" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    name: 'SnapshotSource',
    props: ['stepId'],
    methods: {
        buildSnapshotUrl(stepId) {
            return `/api/snapshots/html/${stepId}`;
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


