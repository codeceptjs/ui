<template>
    <div class="WaitStep has-text-grey">
      <div v-if="step.name='waitForVisible'">
        <i class="Step-icon fas fa-hourglass"></i> {{step.humanized}} <span class="WaitStep-arg has-text-info">{{formatSelector(step.args[0])}}</span>
      </div>
      <div v-else>
        <i class="Step-icon fas fa-hourglass"></i> {{step.humanized}} <span class="WaitStep-arg has-text-info">{{step.args[0]}}</span>
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
      }
    }
}
</script>

<style>
.WaitStep {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.WaitStep-arg {
}

</style>


