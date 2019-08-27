<template>
    <div class="WaitStep has-text-grey-light columns is-gapless">
      <div class="column is-3">
        I {{step.humanized}}
      </div>
      <div class="column is-9 ellipsize">
        <div v-if="step.name === 'waitForVisible' || step.name === 'waitForEnabled'">
          <span class="WaitStep-arg">{{formatSelector(step.args[0])}}</span>
        </div>
        <div v-else-if="step.name === 'waitForNavigation'">
        </div>
        <div v-else-if="step.name === 'waitInUrl'">
          {{formatSelector(step.args[0])}}
        </div>
        <div v-else>
          <span class="WaitStep-arg">{{step.args[0]}}</span> seconds
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


