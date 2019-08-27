<template>
  <div class="Scenarios">
     <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
            <a class="navbar-item" href="#">
                <img src="../assets/logo.png">
                &nbsp;
                <b>code</b>press
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
        </div>
      </div>
    </nav>

    <section>
      <div class="container">
        <h1 class="title">{{project.name}}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="SearchField field has-addons">
          <p class="control">
            <input class="input is-small" type="text" placeholder="Search" v-model="search" @change="loadProject()">
          </p>
          <p class="control">
            <a class="button is-small is-primary is-outlined" v-if="isMatchType('all')" @click="selectMatchType('any')">
              Match All (AND)
            </a>
            <a class="button is-small is-primary is-outlined" v-if="isMatchType('any')" @click="selectMatchType('all')">
              Match Any (OR)
            </a>
          </p>
        </div>
      </div>
    </section>

    <section>
      <div class="container">

        <ul>
          <li v-bind:key="capability" v-for="(features, capability) in project.features">
            <div class="Capability">
              <h2 class="Capability-headline is-size-6 has-text-grey">
                <i class="far fa-folder-open"></i> {{capability}}
              </h2>

              <div class="Capability-content">
                <feature :feature="feature" :key="feature.feature.title" v-for="feature in features" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

  </div>
</template>

<script>
import axios from 'axios';
import Feature from './Feature';

export default {
  name: 'Scenarios',
  components: {
    Feature
  },
  data() {
      return {
          loading: false,
          search: '',
          matchType: 'all',
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
.SearchField input {
  width: 600px;
}

.Capability {
}

.Capability-content {
  padding-left: 1rem;
}

.Capability-headline {
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: .2rem;
}
</style>
