<template>
    <div class="SeeStep">
      <span class="SeeStep-tag tag" v-bind:class="{ 'is-success': step.result === 'passed', 'is-danger': step.result === 'failed' }">
          see
      </span>

      <span v-if="step.args == 1">
        {{formatStepName(step.humanized)}} <span class="SeeStep-selector">{{formatSelector(step.args[0])}}</span>
      </span>
      <span v-else>
        {{formatStepName(step.humanized)}} <span class="SeeStep-text">"{{step.args[0]}}"</span>&nbsp;<span class="SeeStep-selector">{{formatSelector(step.args[1])}}</span>
      </span>

    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'SeeStep',
    props: ['step'],
    methods: {
      formatStepName(stepName) {
        return stepName.replace('see', '');
      },
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style lang="scss">
.SeeStep {
  margin-left: .2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.SeeStep-tag {
  width: 4em;
}

.SeeStep-selector {
    color: hsl(204, 86%, 53%);
}

.SeeStep-text {
    color: hsl(171, 100%, 41%);
}
</style>
