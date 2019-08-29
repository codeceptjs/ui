<template>
    <div class="DontSeeStep has-text-grey columns is-gapless">
      <div class="column is-3">
        <span class="DontSeeStep-tag">
           I
          <strong :class="{ 'has-text-success': step.result === 'passed', 'has-text-danger': step.result === 'failed' }">
           {{step.humanized}} 
           </strong> 
        </span>
      </div>
      <div class="column is-9 ellipsize">
        <span v-if="step.args.length == 1">
          <span class="DontSeeStep-text">{{formatSelector(step.args[0])}}</span>
        </span>
        <span v-else>
          <span class="DontSeeStep-text">"{{step.args[0]}}"</span> within
          <span class="DontSeeStep-selector has-text-info">{{step.args[1]}}</span>
        </span>
      </div>
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'DontSeeStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
        return getSelectorString(sel).label;
      },
      formatStepName(stepName) {
         return stepName
          .replace('dont see', '')
          .replace('number of', '#')
          .replace('elements', '');
      }
    }
}
</script>

<style>
.DontSeeStep {
}

.DontSeeStep-selector {
}

.DontSeeStep-text {
  color: hsl(171, 100%, 41%);
}

.DontSeeStep-tag {
  width: 4em;
}

.ellipsize {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>


