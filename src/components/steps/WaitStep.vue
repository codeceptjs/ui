<template>
    <div class="WaitStep">
      <div v-if="step.name='waitForVisible'">
        <i class="Step-icon fas fa-hourglass"></i> {{step.humanized}} <span class="WaitStep-arg">{{formatSelector(step.args[0])}}</span>
      </div>
      <div v-else>
        <i class="Step-icon fas fa-hourglass"></i> {{step.humanized}} <span class="WaitStep-arg">{{step.args[0]}}</span>
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
  color: hsl(0, 0%, 71%);
}

.WaitStep-arg {
  color: hsl(0, 0%, 71%);
}

</style>


