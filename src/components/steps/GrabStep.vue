<template>
    <div class="GrabStep columns is-gapless">
        <div class="column is-3 ellipsize">
            I {{step.humanized}}
        </div>
        <div class="column is-9 ellipsize">
            <span class="GrabStep-selector">{{formatSelector(step.args[0])}}</span> == "{{step.returnValue}}"
        </div>
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
}

.GrabStep-selector {
  color: hsl(204, 86%, 53%);
}
</style>


