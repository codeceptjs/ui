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
        <div class="field has-addons">
          <p class="control">
            <input class="input is-rounded" type="text" placeholder="Search" v-model="search" @change="loadProject()">
          </p>
          <p class="control">
            <a class="button is-primary" v-if="isMatchType('all')" @click="selectMatchType('any')">
              Match All
            </a>
            <a class="button is-primary" v-if="isMatchType('any')" @click="selectMatchType('all')">
              Match Any
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
              <h2 class="title is-size-6 has-text-info">
                {{capability}}
              </h2>

              <div class="TestFile box" :key="feature.feature.title" v-for="feature in features">
                <a class="TestFile-fileName has-text-grey-light" v-on:click="openInEditor(feature.file)">{{feature.fileBaseName}}</a>
                <h3 class="title is-size-6">
                  <span>
                    {{feature.feature.title}}
                  </span>
                  <span class="tag is-light" :key="tag" v-for="tag in feature.feature.tags">{{tag}}</span>
                </h3>

                <ul>
                  <li class="TestFile-scenario" v-bind:key="scenario.id" v-for="scenario in feature.scenarios">
                    <div v-if="!scenario.pending">
                      <a 
                        class="TestFile-scenarioRunLink"
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
    }
  },
  methods: {
      selectMatchType(t) {
        this.matchType = t;
      },

      isMatchType(t) {
        return this.matchType === t;
      },

      loadProject() {
          history.pushState({}, '', `/?q=${encodeURIComponent(this.search)}`);
          this.loading = true
          axios.get(`/api/scenarios?q=${this.search}`)
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
.TestFile {
  margin-bottom: 0.5em;
}

.TestFile-fileName {
  font-size: 0.8em;
}
</style>
