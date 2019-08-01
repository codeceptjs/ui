<template>
    <div class="DontSeeStep has-text-grey">
      <span class="tag" v-bind:class="{ 'is-success': step.result === 'passed', 'is-danger': step.result === 'failed' }">
        dont
      </span>

      <span v-if="step.args.length == 1">
        {{formatStepName(step.humanized)}} <span class="DontSeeStep-text">{{formatSelector(step.args[0])}}</span>
      </span>
      <span v-else>
        {{formatStepName(step.humanized)}} 
        <span class="DontSeeStep-text">"{{step.args[0]}}"</span>
        &nbsp;
        <span class="DontSeeStep-selector has-text-info">{{step.args[1]}}</span>
      </span>
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
        return stepName.replace('dont', '');
      }
    }
}
</script>

<style>
.DontSeeStep {
  margin-left: .2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.DontSeeStep-selector {
}

.DontSeeStep-text {
  color: hsl(171, 100%, 41%);
}

</style>


