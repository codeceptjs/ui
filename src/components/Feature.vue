<template>
  <div class="Feature">
    <a
      class="Feature-fileName has-text-grey-light"
      @click="openInEditor(feature.file)"
    >&nbsp;{{ feature.fileBaseName }}</a>
    <h3 class="Feature-title title is-size-6 has-text-grey-dark">
      <section>
        <b-collapse
          class="card"
          aria-id="contentIdForA11y3"
          open="false"
        >
          <div
            slot="trigger"
            slot-scope="props"
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">
              <i class="far fa-file has-text-grey" />
              {{ feature.feature.title }}
              <b-tag
                class="Tag"
                rounded
                :key="tag"
                v-for="tag in feature.feature.tags"
              >
                {{ tag }}
              </b-tag>
            </p>
            <div class="FeatureActions">
              <a
                class="FeatureActions-runButton button is-small"
                @click="runFeature(feature.feature.title)"
              >
                <i class="far fa-play-circle" /> Run
              </a>
            </div>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
          <div class="card-content">
            <div class="content">
              <ul>
                <li
                  :key="scenario.id"
                  v-for="scenario in feature.scenarios"
                >
                  <Scenario :scenario="scenario" />
                </li>
              </ul>
            </div>
          </div>
        </b-collapse>
      </section>
    </h3>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

import Scenario from './Scenario';

export default {
  name: 'Feature',
  components: {
    Scenario
  },
  props: {
    feature: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  methods: {
    humanize(ts) {
      return moment.unix(ts / 1000).fromNow();
    },

    openInEditor(file) {
      axios.get(`/api/tests/${encodeURIComponent(file)}/open`);
    },

    runFeature(featureTitle) {
      this.$store.dispatch('testRuns/runGrep', featureTitle);
    }
  }
};
</script>

<style>
.Tag {
  opacity: 0;
  margin-left: 0.25rem !important;
}

.Feature:hover .Tag {
  transition: all 0.3s;
  opacity: 1;
}

.Feature {
}

.Feature-fileName {
  opacity: 0;
  font-size: 0.8em;
}

.Feature:hover .Feature-fileName {
  opacity: 1;
  transition: all 0.25s;
}

.Feature-title {
  margin-bottom: 0.5rem !important;
}

.Feature .FeatureActions {
  opacity: 0;
}

.Feature:hover .FeatureActions {
  transition: all 0.25s ease-in-out;
  opacity: 1;
}
</style>
