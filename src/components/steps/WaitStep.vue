<template>
    <div class="WaitStep has-text-grey-light columns is-gapless">
      <div class="column is-3">
        <i class="Step-icon far fa-hourglass"></i> {{formatStep(step.humanized)}}
      </div>
      <div class="column is-9">
        <div v-if="step.name='waitForVisible'">
          <span class="WaitStep-arg">{{formatSelector(step.args[0])}}</span>
        </div>
        <div v-else>
          <span class="WaitStep-arg">{{step.args[0]}}</span>
        </div>
      </div>
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'WaitStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
        return getSelectorString(sel).label;
      },
      formatStep(stepName) {
        return stepName.replace('wait ', '').replace('for ', '');
      }
    }
}
</script>

<style>
.WaitStep {
}

.WaitStep-arg {
}

</style>


