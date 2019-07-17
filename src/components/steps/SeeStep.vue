<template>
    <div class="SeeStep">
      <span class="tag is-success">
          assert
      </span>

      <span v-if="step.args == 1">
        {{step.humanized}} <span class="SeeStep-selector">{{formatSelector(step.args[0])}}</span>
      </span>
      <span v-else>
        {{step.humanized}} <span class="SeeStep-text">{{step.args[0]}}</span>&nbsp;<span class="SeeStep-selector">{{formatSelector(step.args[1])}}</span>
      </span>

    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'SeeStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style>
.SeeStep {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.SeeStep-selector {
    color: hsl(204, 86%, 53%);
}

.SeeStep-text {
    color: hsl(171, 100%, 41%);
}
</style>
