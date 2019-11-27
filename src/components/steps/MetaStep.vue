<template>
  <div class="step">
    <i
      class="fas fa-chevron-down  arrow"
      :class="{ 'is-opened': step.expanded }"
    />
    <strong class="StepMetaStep has-text-grey">
      {{ actorFromMetaStep(step) }}
    </strong>
    <strong class="StepMetaStep has-text-dark">
      {{ methodFromMetaStep(step) }}
    </strong>
  </div>
</template>

<script>
export default {
  name: 'MetaStep',
  props: {
    step: {
      type: Object,
      required: true,
    },
    isOpened : {
      type: Boolean,
      required: true
    }
  },
  methods: {
    actorFromMetaStep(step) {
      if (step.actor) {
        const actor = step.actor === 'Context:' ? step.name : step.actor;
        return actor;
      }
      return 'In Scenario';
    },

    methodFromMetaStep(step) {
      if (step.actor) {
        const name = step.actor === 'Context:' ? '' : step.name;
        return name;
      }
      return '';
    },
  }
};
</script>

<style>
.MetaStep {
  font-family: -apple-system,BlinkMacSystemFont,Lato,Helvetica Neue,sans-serif;
}
.step i {  transition: 0.5s all; }
.arrow {
    @apply text-gray-500;
}
.is-opened {
    transform: rotate(-90deg);
}
</style>


