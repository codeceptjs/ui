<template>
  <nav class="level">
    <div class="level-item is-expanded">
      <i class="far fa-check-circle mr-1" aria-hidden="true"></i>     
      Successful
      <b-tag rounded > {{successful}}</b-tag>
    </div>
    <div class="level-item is-expanded">
        <i class="far fa-times-circle mr-1" aria-hidden="true"></i> 
        Failed
        <b-tag rounded> {{failed}}</b-tag>
    </div>
    <div class="level-item is-expanded">
      <div class="field">
          <i class="fas fa-forward mr-1" aria-hidden="true"></i>
          Skipped
          <b-tag rounded>{{skipped}}</b-tag>
      </div>
    </div>
    <div class="level-item is-expanded">
        <i class="far fa-hourglass mr-1" aria-hidden="true"></i>
        Not Started
        <b-tag rounded>{{pending}}</b-tag>
    </div>
    <div class="level-item is-expanded">
      <i class="fas fa-list mr-1" aria-hidden="true"></i>
      Suites
      <b-tag rounded>{{totalFeatures}}</b-tag>
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
  z-index: 100;
  @apply bg-gray-100 fixed inset-x-0 bottom-0 p-1;
}
</style>
