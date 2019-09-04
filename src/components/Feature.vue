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
      <li :key="scenario.id" v-for="scenario in feature.scenarios">
        <Scenario :scenario="scenario" />
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

import Scenario from './Scenario';

export default {
  name: 'Feature',
  components: {
    Scenario,
  },
  props: ['feature'],
  data() {
    return {
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
  opacity: 0;
  font-size: 0.8em;
}

.Feature:hover .Feature-fileName {
  opacity: 1;
  transition: all .25s;
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
</style>