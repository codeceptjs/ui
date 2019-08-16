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
        <input class="input is-rounded" type="text" placeholder="Search" v-model="search" @change="loadProject()"/>
      </div>
    </section>

    <section>
      <div class="container">

        <ul>
          <li v-bind:key="feature.feature.title" v-for="feature in project.features">
            <div class="TestFile box">
              <a class="TestFile-fileName has-text-grey-light" v-on:click="openInEditor(feature.file)">{{feature.fileBaseName}}</a>
              <h3 class="subtitle">
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
        return `/#/testrun/${scenarioId}`;
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
