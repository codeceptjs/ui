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
                <div class="Feature box" :key="feature.feature.title" v-for="feature in features">
                  <a class="Feature-fileName has-text-grey-light" v-on:click="openInEditor(feature.file)">{{feature.fileBaseName}}</a>
                  <h3 class="Feature-title title is-size-6">
                    <span>
                      {{feature.feature.title}}
                    </span>
                    <span class="tag is-light" :key="tag" v-for="tag in feature.feature.tags">{{tag}}</span>
                  </h3>

                  <ul>
                    <li class="Feature-scenario" v-bind:key="scenario.id" v-for="scenario in feature.scenarios">
                      <div v-if="!scenario.pending">
                        <a 
                          class="Feature-scenarioRunLink"
                          @click="selectScenario(scenario)"
                          :href="linkToScenario(scenario.id)">
                          {{scenario.title}}
                        </a>
                        <span class="tag is-light" :key="tag" v-for="tag in scenario.tags">{{tag}}</span>
                      </div>
                      <div v-else class="has-text-info">
                        {{scenario.title}}
                        <span class="tag is-light" :key="tag" v-for="tag in scenario.tags">{{tag}}</span>
                      </div>
                    </li>
                  </ul>
                </div>
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

export default {
  name: 'Scenarios',
  components: {
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
    this.loadProject()
  },
  sockets: {
    'codeceptjs:scenarios.updated': function () {
      this.loadProject();

      this.$buefy.toast.open({
        message: 'Scenarios have been reloaded',
        type: 'is-success'
      })
    },
    'codeceptjs:scenarios.parseerror': function (err) {
      const stackFrames = err.stack.split('\n');

      this.$buefy.toast.open({
        duration: 10000,
        message: `"${err.message}"\n${stackFrames[0]} in ${stackFrames[1]}`,
        position: 'is-top',
        type: 'is-danger'
      });
    },
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

      loadProject() {
        this.updateUrl();
          
        this.loading = true
        axios.get(`/api/scenarios?q=${this.search}&m=${this.matchType}`)
          .then(response => {
              this.loading = false
              this.project = response.data
          })
          .catch(() => {
              this.loading = false
          })
      },

      selectScenario(scenario) {
        this.$store.commit('scenarios/selectScenario', scenario);
      },

      linkToScenario(scenarioId) {
        return `/#/testrun/${encodeURIComponent(scenarioId)}`;
      },

      openInEditor(file) {
        axios.get(`/api/tests/${encodeURIComponent(file)}/open`);
      }
  }
}
</script>

<style>
.Feature {
  margin-bottom: 0.5rem !important;
}

.Feature-fileName {
  font-size: 0.8em;
}

.Feature-title {
  margin-bottom: 1rem !important;
}

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
