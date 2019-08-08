<template>
    <div class="GrabStep has-text-grey-light columns">
        <div class="column is-3">
            I {{step.humanized}}
        </div>
        <div class="column is-9 ellipsize">
             {{formatSelector(step.args[0])}} = {{step.returnValue}}

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsize {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>


