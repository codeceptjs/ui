<template>
  <div class="ScenariosPage">
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
        <b-navbar-item>
          <RunButton @run="run()" />
        </b-navbar-item>           
        <b-navbar-item class="is-hidden-desktop">
          <SettingsMenu />
        </b-navbar-item>   
      </template>
      <template slot="start">
        <b-navbar-item>
          <a
            class="navbar-item"
            role="button"
            @click="gotoNewTest()"
          >
    
            <i class="fas fa-edit mr-2" />
            Write a Test
          </a>
          <a
            class="navbar-item"
            role="button"
            @click="gotoPageObjects"
          >
            <i class="fas fa-file mr-2" />
            Page Objects
          </a>
        </b-navbar-item>
        <b-navbar-item class="hide-on-small">
          <p class="control ">
            <input
              class="input is-small"
              @focus="$event.target.select()"
              type="text"
              placeholder="Search"
              v-model="search"
              @change="loadProject()"
            >
          </p>
          <p class="control">
            <a
              class="button is-small"
              @click="clearSearch()"
            >
              <i class="far fa-times-circle" />
            </a>
            <a
              class="button is-small"
              v-if="isMatchType('all')"
              @click="selectMatchType('any')"
            >All</a>
            <a
              class="button is-small"
              v-if="isMatchType('any')"
              @click="selectMatchType('all')"
            >Any</a>
          </p>
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item class="is-hidden-touch">
          <SettingsMenu />
        </b-navbar-item>
      </template>
    </b-navbar>
    <section
      class="Project"
      v-if="project.name"
    >
      <div class="container">
        <h1 class="title">
          {{ project.name }}
        </h1>
      </div>
    </section>
    <section>
      <div class="container">
        <Test-statistics
          :features="project.features"
          v-if="project.features"
        />
      </div>
    </section>
    <section>
      <div class="container">
        <ul
          v-if="hasSearchResults"
          class="mb-8"
        >
          <li
            :key="capability"
            v-for="(features, capability) in project.features"
          >
            <div class="Capability">
              <h2 class="Capability-headline is-size-6">
                <CapabilityFolder :folder="capability" />
              </h2>

              <div class="Capability-content">
                <feature
                  :feature="feature"
                  :key="feature.feature.title"
                  v-for="feature in features"
                />
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
import Feature from '../Feature';
import CapabilityFolder from '../CapabilityFolder';
import SettingsMenu from '../SettingsMenu';
import TestStatistics from '../TestStatistics';
import RunButton from '../RunButton';
import Logo from '../Logo';

export default {
  name: 'Scenarios',
  components: {
    Logo,
    Feature,
    CapabilityFolder,
    SettingsMenu,
    TestStatistics,
    RunButton
  },
  data() {
    return {
      loading: false,
      search: '',
      matchType: 'any',
      project: {}
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.search = urlParams.get('q') || '';
    this.loadProject();
    this.loadScenarioStatus();
  },
  sockets: {
    'codeceptjs:scenarios.updated': function() {
      this.loadProject();
    }
  },
  computed: {
    hasSearchResults() {
      return (
        this.project &&
        this.project.features &&
        Object.keys(this.project.features).length > 0
      );
    }
  },
  methods: {
    run() {
      if (!this.search) {
        return this.$store.dispatch('testRuns/runAll');
      }
      this.$store.dispatch('testRuns/runGrep', this.search);
    },
    gotoNewTest() {
      this.$router.push('/new-test');
    },
    gotoPageObjects() {
      this.$router.push('/page-objects');
    },
    clearSearch() {
      this.search = '';
      this.loadProject();
    },

    selectMatchType(t) {
      this.matchType = t;
      this.loadProject();
    },

    isMatchType(t) {
      return this.matchType === t;
    },

    updateUrl() {
      history.pushState(
        {},
        '',
        `/?q=${encodeURIComponent(this.search)}&m=${this.matchType}`
      );
    },

    async loadScenarioStatus() {
      this.$store.dispatch('scenarios/loadInitialScenarioStatus');
    },

    async loadProject() {
      this.updateUrl();

      this.loading = true;
      const loadingComponent = this.$buefy.loading.open({ container: null });

      try {
        const response = await axios.get(
          `/api/scenarios?q=${this.search}&m=${this.matchType}`
        );
        this.project = response.data;
      } finally {
        this.loading = false;
        loadingComponent.close();
      }
    }
  }
};
</script>

<style>
.Project {
  @apply mt-5 ml-2;
}

.SearchField input {
  width: 220px;
}

.Capability {
  padding: 0.5rem;
}

.Capability-content {
  padding-left: 1rem;
}

.Capability-headline {
  margin-top: 0.25rem;
}


</style>
