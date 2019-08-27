<template>
    <div class="SwitchToStep has-text-grey columns is-gapless">
      <div class="column is-3">
        I {{step.humanized}}
      </div>
      <div class="column is-9 ellipsize">
        <span class="SwitchToStep-arg">{{step.args[0]}}</span>
      </div>
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'SwitchToStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style>
.SwitchToStep {
}

.SwitchToStep-arg {
}

</style>


