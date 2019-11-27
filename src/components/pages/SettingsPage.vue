<template>
  <section class="SettingsPage">
    <div class="container">
      <Header />
      <b-button
        type="is-light float-right"
        size="is-medium"
        @click="editConfig()"
      >
        <i class="fas fa-edit" /> Edit Config
      </b-button>
      <h1 class="title">
        Configuration: <span class="is-small text-gray-600">{{ config.file }}</span>
      </h1>
      <pre
        v-if="config.config"
        v-highlightjs="JSON.stringify(config.config, null, 1)"
      >
        <code class="javascript" />
      </pre>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import Header from '../Header';

export default {
  name: 'SettingsPage',
  components: {
    Header
  },
  data() {
    return {
      config: {},
    };
  },
  async created() {
    const config = await axios.get('/api/config');
    this.config = config.data;
  },
  methods: {
    editConfig() {
      axios.get(`/api/tests/${encodeURIComponent(this.config.file)}/open`);
    }
  }
};
</script>
