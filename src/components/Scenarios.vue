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
          <li v-for="feature in project.features">
            <div class="TestFile box">
              <a class="TestFile-fileName has-text-grey-light" v-on:click="linkToOpen(feature.file)">{{feature.fileRelPath}}</a>
              <h4 class="subtitle">{{feature.feature.title}}</h4>

              <ul>
                <li class="TestFile-scenario" v-for="scenario in feature.scenarios">
                  <a 
                    class="TestFile-scenarioRunLink" 
                    v-on:click="selectScenario(scenario)"
                    :href="linkToScenario(scenario)">
                    {{scenario.title}}
                  </a>
                  <span class="tag is-light" v-for="tag in scenario.tags">{{tag}}</span>
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
      this.loadProject()
  },
  sockets: {
    'codeceptjs:scenarios.updated': function (data) {
      console.log('codeceptjs:scenarios.updated', data);
      this.loadProject();
    },

    'codeceptjs:scenarios.parseerror': function (data) {
      console.log('codeceptjs:scenarios.parseerror', data);
    },
  },
  methods: {
      loadProject() {
          this.loading = true
          axios.get(`/api/scenarios?q=${this.search}`)
            .then(response => {
                this.loading = false
                this.project = response.data
            })
            .catch(error => {
                this.loading = false
            })
      },

      selectScenario(scenario) {
        this.$store.commit('selectScenario', scenario);
      },

      linkToScenario(scenario) {
        return `/#/testrun/${encodeURIComponent(scenario.orgTitle)}`;
      },

      linkToOpen(file) {
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
