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
    <EditorNotFound
      :error="error"
      :is-opened="!!error"
    />
  </div>
</template>

<script>
import axios from 'axios';
import EditorNotFound from './EditorNotFound';

export default {
  name: 'ScenarioSource',
  props: {
    source : {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    }
  },
  components: {
    EditorNotFound,
  },
  data() {
    return {
      error: null,
    };
  },
  methods: {
    editFile() {
      axios
        .get(`/api/tests/${encodeURIComponent(this.file)}/open`)
        .then(() => {
          this.error = null;
        })
        .catch((error) => {
          this.error = error.response.data;
        });
    },
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
.error {
}
.error-message {
  @apply text-red-600;
}
</style>


