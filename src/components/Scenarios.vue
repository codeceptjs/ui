<template>
  <div class="container is-fluid">
    
    <section class="section">
      <div class="container">
        <h1 class="title">Welcome to codepress!</h1>
        <h2 class="subtitle">
          Select one of the scenarios listed below to run it.
        </h2>

        <ul>
          <li v-for="file in files">
            <div class="TestFile box">
              <a class="TestFile-fileName" v-on:click="linkToOpen(file.file)">{{file.file}}</a>
              <h4 class="subtitle">{{file.feature.title}}</h4>

              <ul>
                <li class="TestFile-scenario" v-for="scenario in file.scenarios">
                  <a class="TestFile-scenarioRunLink" :href="linkToScenario(scenario)">{{scenario.title}}</a>
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
  data() {
      return {
          loading: false,
          files: []
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
                this.files = response.data
            })
            .catch(error => {
                this.loading = false
            })
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
