<template>
    <div class="ScenarioSource">
        <pre v-highlightjs="source"><code class="javascript"></code></pre>
    </div>
</template>

<script>
export default {
  name: 'ScenarioSource',
  props: ['source'],
  components: {},
}
</script>

<style>
.ScenarioSource {
    font-size: .9rem;
}

.ScenarioSource pre {
    padding: 0;
    background-color: white;
}

.ScenarioSource code {
    overflow: hidden;
}
</style>


