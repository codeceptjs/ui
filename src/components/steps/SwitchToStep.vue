<template>
    <div class="SwitchToStep has-text-grey-light columns is-gapless">
      <div class="column is-3">
        <i class="Step-icon far fa-window-restore"></i> {{step.humanized}}
      </div>
      <div class="column is-9">
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
  padding-left: .5em;
}

.SwitchToStep-arg {
}

</style>


