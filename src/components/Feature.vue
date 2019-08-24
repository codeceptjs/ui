<template>
  <div class="Feature box">
    <a class="Feature-fileName has-text-grey-light" v-on:click="openInEditor(feature.file)">{{feature.fileBaseName}}</a>
    <h3 class="Feature-title title is-size-6">
      <span>
        {{feature.feature.title}}
      </span>
      <span class="tag is-light" :key="tag" v-for="tag in feature.feature.tags">{{tag}}</span>

      <div class="FeatureActions is-pulled-right">
        <div class="button is-small" @click="runFeature(feature.feature.title)">
          <i class="far fa-play-circle"></i> Run
        </div>
      </div>
    </h3>

    <ul>
      <li class="Feature-scenario" v-bind:key="scenario.id" v-for="scenario in feature.scenarios">
        <div v-if="!scenario.pending">
          <a 
            class="Feature-scenarioRunLink"
            @click="selectScenario(scenario)"
          >
            <span class="Scenario-status">
              <i v-if="testStatus(scenario.id) === 'not run'" class="far fa-circle has-text-grey-light"></i>
              <i v-if="testStatus(scenario.id) === 'failed'" class="fas fa-circle has-text-danger"></i>
              <i v-if="testStatus(scenario.id) === 'passed'" class="fas fa-circle has-text-success"></i>
              <i  v-if="testStatus(scenario.id) === 'running'" class="fas fa-circle-notch has-text-grey"></i>
            </span>

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
</template>

<script>
import axios from 'axios';

export default {
  name: 'Feature',
  props: ['feature'],
  data() {
    return {

    }
  },
  computed: {
    testStatus() {
      return scenarioId => this.$store.getters['scenarios/testStatus'](scenarioId);
    }
  },
  methods: {
    openInEditor(file) {
      axios.get(`/api/tests/${encodeURIComponent(file)}/open`);
    },

    selectScenario(scenario) {
      this.$store.commit('scenarios/selectScenario', scenario);
      this.$router.push(`/testrun/${encodeURIComponent(scenario.id)}`);
    },

    runFeature(featureTitle) {
       this.$store.dispatch('scenarios/runFeature', { featureTitle });
    },
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
</style>