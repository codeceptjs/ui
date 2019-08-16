<template>
    <div class="SeeStep columns is-gapless">
      <div class="column is-3">
        <span class="SeeStep-tag has-text-success" v-bind:class="{ 'is-success': step.result === 'passed', 'is-danger': step.result === 'failed' }">
          <i class="fas fa-eye"/>
          {{formatStepName(step.humanized)}} 
        </span>
      </div>
      <div class="column is-9">
        <span v-if="step.args.length === 1">
           <span class="SeeStep-selector">{{formatSelector(step.args[0])}}</span>
        </span>
        <span v-else>
          <div class="SeeStep-text">"{{step.args[0]}}"</div>
          <div class="SeeStep-selector">{{formatSelector(step.args[1])}}</div>
        </span>
      </div>
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'SeeStep',
    props: ['step'],
    methods: {
      formatStepName(stepName) {
        return stepName
          .replace('see', '')
          .replace('number of', '#')
          .replace('elements', '');
      },
      formatSelector(sel) {
        const selString = getSelectorString(sel);
        return selString.label;
      }
    }
}
</script>

<style lang="scss">
.SeeStep {
}

.SeeStep-tag {
}

.SeeStep-selector {
  color: hsl(204, 86%, 53%);
}

.SeeStep-text {
  color: hsl(171, 100%, 41%);
}
</style>
