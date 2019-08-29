<template>
    <div class="SeeStep columns is-gapless">
      <div class="column is-3">
        <span class="SeeStep-tag">
          I 
          <strong :class="{ 'has-text-success': step.result === 'passed', 'has-text-danger': step.result === 'failed' }">
            {{step.humanized}} 
          </strong>
        </span>
      </div>
      <div class="column is-9">
        <span v-if="step.name === 'seeNumberOfVisibleElements'">
          <span class="SeeStep-selector">{{formatSelector(step.args[0])}}</span>
          is
          <span class="SeeStep-text">{{step.args[1]}}</span>
        </span>
        
        <span v-else-if="step.name === 'see' && step.args.length === 1">
          <span class="SeeStep-text">"{{step.args[0]}}"</span>
        </span>

        <span v-else>
          <span v-if="step.args.length === 1" class="SeeStep-selector">{{formatSelector(step.args[0])}}</span>
          <span v-else>
            <span class="SeeStep-text">"{{step.args[0]}}"</span>
            within
            <span class="SeeStep-selector">{{formatSelector(step.args[1])}}</span>
          </span>
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
