<template>
    <div class="GrabStep">
        <i class="Step-icon fas fa-hands"></i> 
        {{step.humanized}} {{formatSelector(step.args[0])}} = {{step.returnValue}}
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'GrabStep',
    props: ['step'],
     methods: {
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style>
.GrabStep {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: hsl(0, 0%, 71%);
}
</style>


