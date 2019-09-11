<template>
  <div class="ScenariosPage">
     <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="../assets/logo.png" alt="codepress logo">
            &nbsp;
            codepress
          </a>

          <div class="SearchField navbar-item field has-addons">
            <p class="control">
              <input class="input is-small" @focus="$event.target.select()" type="text" placeholder="Search" v-model="search" @change="loadProject()">
            </p>
            <p class="control">
              <a class="button is-small" @click="clearSearch()">
                <i class="far fa-times-circle"></i>
              </a>
              <a class="button is-small is-primary" v-if="isMatchType('all')" @click="selectMatchType('any')">
                Match All
              </a>
              <a class="button is-small is-primary" v-if="isMatchType('any')" @click="selectMatchType('all')">
                Match Any
              </a>
            </p>
          </div>
        </div>

        <div class="navbar-menu">
            <div class="navbar-end">
              <SettingsMenu />
            </div>
        </div>
      </div>
    </nav>

    <section class="Project" v-if="project.name">
      <div class="container">
        <h1 class="title">{{project.name}}</h1>
      </div>
    </section>

    <section>
      <div class="container">

        <ul v-if="hasSearchResults()">
          <li :key="capability" v-for="(features, capability) in project.features">
            <div class="Capability">
              <h2 class="Capability-headline is-size-6">
                <CapabilityFolder :folder="capability" />
              </h2>

              <div class="Capability-content">
                <feature :feature="feature" :key="feature.feature.title" v-for="feature in features" />
              </div>
            </div>
          </li>
        </ul>
        <b-message v-else>
          No features or scenario are matching your search
        </b-message>
      </div>
    </section>

  </div>
</template>

<script>
import axios from 'axios';
import Feature from './Feature';
import CapabilityFolder from './CapabilityFolder';
import SettingsMenu from './SettingsMenu';

export default {
  name: 'Scenarios',
  components: {
    Feature, CapabilityFolder, SettingsMenu
  },
  data() {
      return {
          loading: false,
          search: '',
          matchType: 'any',
          project: {}
      }
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.search = urlParams.get('q') || '';
    this.loadProject();
    this.loadScenarioStatus();
  },
  sockets: {
    'codeceptjs:scenarios.updated': function () {
      this.loadProject();
    }
  },
  methods: {
      clearSearch() {
        this.search = '';
        this.loadProject();
      },

      hasSearchResults() {
        return this.project && this.project.features && Object.keys(this.project.features).length > 0;
      },

      selectMatchType(t) {
        this.matchType = t;
        this.loadProject();
      },

      isMatchType(t) {
        return this.matchType === t;
      },

      updateUrl() {
        history.pushState({}, '', `/?q=${encodeURIComponent(this.search)}&m=${this.matchType}`);
      },

      async loadScenarioStatus() {
        this.$store.dispatch('scenarios/loadInitialScenarioStatus');
      },

      async loadProject() {
        this.updateUrl();
          
        this.loading = true
        const loadingComponent = this.$buefy.loading.open({ container: null });

        try {
          const response = await axios.get(`/api/scenarios?q=${this.search}&m=${this.matchType}`);
          this.project = response.data;
        } finally {
          this.loading = false;
          loadingComponent.close();
        }
      },
  }
}
</script>

<style>
.Project {
  margin-top: 60px;
}

.SearchField input {
  width: 220px;
}

.Capability {
  padding: .5rem;
}

.Capability-content {
  padding-left: 1rem;
}

.Capability-headline {
  margin-top: .25rem;
}
</style>
