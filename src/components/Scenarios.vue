<template>
  <div class="container is-fluid">
     <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="#">
                <img src="../assets/logo.png">

                <b>code</b>press
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div>
    </nav>

    <section class="section">
      <div class="container">
        <h1 class="title">{{project.name}}</h1>
        <h2 class="subtitle">
          Select one of the scenarios listed below to run it.
        </h2>

        <ul>
          <li v-for="feature in project.features">
            <div class="TestFile box">
              <a class="TestFile-fileName" v-on:click="linkToOpen(feature.file)">{{feature.file}}</a>
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
 import Header from './Header';

export default {
  name: 'Scenarios',
  components: {
    Header,
  },
  data() {
      return {
          loading: false,
          project: {}
      }
  },
  created() {
      this.getDataFromApi()
  },
  methods: {
      getDataFromApi() {
          this.loading = true
          axios.get('/api/scenarios')
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
  color: #ccc;
}
</style>
