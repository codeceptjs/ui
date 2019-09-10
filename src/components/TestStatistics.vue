<template>
  <nav class="level">
    <div class="level-item is-expanded">
      <div class="field">
        <span class="icon is-small">
          <i class="fas fa-forward" aria-hidden="true"></i>
        </span>
        <span>
          Skipped
          <b-tag rounded>{{skipped}}</b-tag>
        </span>
      </div>
    </div>
    <div class="level-item is-expanded">
      <span class="icon is-small">
        <i class="far fa-check-circle" aria-hidden="true"></i>
      </span>
      <span>
        Successful
        <b-tag rounded>{{successful}}</b-tag>
      </span>
    </div>
    <div class="level-item is-expanded">
      <span class="icon is-small">
        <i class="far fa-times-circle" aria-hidden="true"></i>
      </span>
      <span>
        Failed
        <b-tag rounded>{{failed}}</b-tag>
      </span>
    </div>
    <div class="level-item is-expanded">
      <span class="icon is-small">
        <i class="far fa-hourglass" aria-hidden="true"></i>
      </span>
      <span>
        Not Started
        <b-tag rounded>{{pending}}</b-tag>
      </span>
    </div>
    <div class="level-item is-expanded">
      <span class="icon is-small">
        <i class="fas fa-list" aria-hidden="true"></i>
      </span>
      <span>
        Features
        <b-tag rounded>{{totalFeatures}}</b-tag>
      </span>
    </div>
  </nav>
</template>

<script>
export default {
  name: "TestStatistics",
  props: ["features"],
  data() {
    return {
      scenarios: this.scenarioIds
    };
  },
  computed: {
    totalFeatures: function() {
      let total = 0;
      for (const test in this.features) {
        total += this.features[test].length;
      }
      return total;
    },
    scenarioIds: function() {
      let scenarios = [];
      for (const testFolder in this.features) {
        const ids = this.features[testFolder].reduce((arr, test) => {
          return arr.concat(test.scenarios.map(scenario => scenario.id));
        }, []);
        scenarios = [...scenarios, ...ids];
      }
      return scenarios;
    },
    successful: function() {
      return this.scenarioIds
        .map(id => this.$store.getters["scenarios/testStatus"](id))
        .filter(scenario => scenario.status === "passed").length;
    },
    failed: function() {
      return this.scenarioIds
        .map(id => this.$store.getters["scenarios/testStatus"](id))
        .filter(scenario => scenario.status === "failed").length;
    },
    skipped: function() {
      let scenarios = [];
      for (const testFolder in this.features) {
        const ids = this.features[testFolder].reduce((arr, test) => {
          return arr.concat(
            test.scenarios.filter(scenario => scenario.pending)
          );
        }, []);
        scenarios = [...scenarios, ...ids];
      }
      return scenarios.length;
    },
    pending: function() {
      return this.scenarioIds
        .map(id => this.$store.getters["scenarios/testStatus"](id))
        .filter(scenario => scenario.status === undefined).length;
    }
  }
};
</script>

<style scoped>
nav {
  z-index: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
