<template>
  <div class="PageObjectsPage">
    <b-navbar
      fixed-top
      :mobile-burger="true"
    >
      <template slot="brand">
        <b-navbar-item
          tag="router-link"
          :to="{ path: '/' }"
        >
          <Logo />
        </b-navbar-item>
        <b-navbar-item class="is-hidden-desktop">
          <SettingsMenu />
        </b-navbar-item>
      </template>
      <template slot="start" />

      <template slot="end">
        <b-navbar-item class="is-hidden-touch">
          <SettingsMenu />
        </b-navbar-item>
      </template>
    </b-navbar>
    <section
      class="PageObject"
      v-if="pageObject"
    >
      <aside class="Sidebar">
        <div>
          <h1 class="title is-size-4 has-text-grey-dark">
            Page Objects
          </h1>
          <br>
        </div>
        <ul style="overflow-y: scroll;">
          <li v-for="(value,name) in pageObject">
            <a
              class="Scenario-detailLink"
              @click="loadPageObjectSource(value.source)"
            >{{ name }}
              <i class="fas fa-angle-right" />
            </a>
          </li>
        </ul>
      </aside>
      <div
        class="Content"
        style="overflow-y: scroll;"
      >
        <pre v-highlightjs="pageObjectSource"><code class="javascript" /></pre>
      </div>
    </section>
  </div>
</template>
<script>
import axios from 'axios';
import SettingsMenu from '../SettingsMenu';
import Logo from '../Logo';

export default {
  name: 'PageObjects',
  components: {
    Logo,
    SettingsMenu,
  },
  data() {
    return {
      loading: false,
      search: '',
      matchType: 'any',
      pageObject: [],
      pageObjectSource: 'Please choose the Page Object to load the source',
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.search = urlParams.get('q') || '';
    this.loadPageObject();
  },

  methods: {
    run() {
      if (!this.search) {
        return this.$store.dispatch('testRuns/runAll');
      }
      this.$store.dispatch('testRuns/runGrep', this.search);
    },

    async loadPageObject() {
      this.loading = true;
      const loadingComponent = this.$buefy.loading.open({ container: null });

      try {
        const response = await axios.get(
          '/api/page-objects'
        );

        this.pageObject = response.data;
      } finally {
        this.loading = false;
        loadingComponent.close();
      }
    },

    loadPageObjectSource(source) {
      this.pageObjectSource = source;
    }
  }
};
</script>

<style>
.PageObject {
  @apply mt-24 ml-2;
}

</style>
