<template>
    <div class="SwitchToStep has-text-grey">
        <i class="Step-icon far fa-window-restore"></i> {{step.humanized}} <span class="SwitchToStep-arg has-text-info">{{step.args[0]}}</span>
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
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.SwitchToStep-arg {
}

</style>


