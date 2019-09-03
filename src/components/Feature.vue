<template>
  <div class="Feature">
    <a class="Feature-fileName has-text-grey-light" v-on:click="openInEditor(feature.file)">{{feature.fileBaseName}}</a>
    <h3 class="Feature-title title is-size-6">
      <span>
        {{feature.feature.title}}
      </span>
      <b-tag class="Tag" rounded :key="tag" v-for="tag in feature.feature.tags">{{tag}}</b-tag>

      <div class="FeatureActions is-pulled-right">
        <a class="FeatureActions-runButton button is-small" @click="runFeature(feature.feature.title)">
          <i class="far fa-play-circle"></i> Run
        </a>
      </div>
    </h3>

    <ul>
      <li class="Scenario" v-bind:key="scenario.id" v-for="scenario in feature.scenarios">
        <div>
          <a 
            class="Scenario-detailLink"
            @click="selectScenario(scenario)"
          >
            <span class="Scenario-status" v-if="existsTestStatus(scenario.id)">
              <i v-if="testStatus(scenario.id) === 'failed'" class="fas fa-square has-text-danger"></i>
              <i v-if="testStatus(scenario.id) === 'passed'" class="fas fa-square has-text-success"></i>
              <i  v-if="testStatus(scenario.id) === 'running'" class="fas fa-circle-notch fa-spin has-text-grey"></i>
            </span>
            <span v-else class="Scenario-status">
              <i class="fas fa-square has-text-grey-lighter"></i>
            </span>
            
            <span :class="{ 'has-text-grey-light': scenario.pending }">
              {{scenario.title}}            
            </span>
          </a>
          <b-tag class="Tag" rounded :key="tag" v-for="tag in scenario.tags">{{tag}}</b-tag>

          <span class="Scenario-property Scenario-duration has-text-grey-light" v-if="testDuration(scenario.id)">
            {{testDuration(scenario.id)}}s
          </span>
          <span class="Scenario-property Scenario-startedAt has-text-grey-light" v-if="testStartedAt(scenario.id)">
            &middot;
            {{humanize(testStartedAt(scenario.id))}}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'Feature',
  props: ['feature'],
  data() {
    return {

    }
  },
  computed: {
    existsTestStatus() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        return status && typeof(status) === 'object' && status.status;
      };
    },
    testStatus() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        if (status) {
          return status.status;
        }
      };
    },
    testDuration() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        if (status) {
          return status.duration;
        }
      };
    },
    testStartedAt() {
      return scenarioId => {
        const status = this.$store.getters['scenarios/testStatus'](scenarioId);
        if (status) {
          return status.startedAt;
        }
      };
    }
  },
  methods: {
    humanize(ts) {
      return moment.unix(ts / 1000).fromNow();
    },

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
.Tag {
  margin-left: .25rem !important;
}

.Feature {
  margin-bottom: 0.5rem !important;
}

.Feature-fileName {
  font-size: 0.8em;
}

.Feature-title {
  margin-bottom: .5rem !important;
}

.Feature .FeatureActions {
  opacity: 0;
}

.Feature:hover .FeatureActions {
 transition: all .25s ease-in-out;
 opacity: 1;
}

.Scenario .Scenario-property {
  opacity: 0;
}

.Scenario:hover .Scenario-property {
  transition: all .3s;
  opacity: 1;
}

</style>