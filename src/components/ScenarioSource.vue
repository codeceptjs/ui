<template>
  <div class="ScenarioSource">
    <pre v-highlightjs="source"><code class="javascript" /></pre>
    <b-button
      v-if="file"
      type="is-light is-small"
      expanded
      @click="editFile()"
    >
      <i class="fas fa-edit" /> Edit Test
    </b-button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ScenarioSource',
  props: {
    source : {
      type: Object,
      required: true,
    },
    file: {
      type: ArrayBuffer,
      required: true,
    }
  },
  components: {},
  methods: {
    editFile() {
      axios.get(`/api/tests/${encodeURIComponent(this.file)}/open`);
    }
  }
};
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


