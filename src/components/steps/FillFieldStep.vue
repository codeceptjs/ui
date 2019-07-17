<template>
    <div class="FillFieldStep">
        I {{step.humanized}}
        <span class="FillFieldStep-selector">{{formatSelector(step.args[0])}}</span>
        &nbsp;
        <span class="FillFieldStep-text" v-if="step.args[1]">"{{step.args[1]}}"</span>
    </div>

</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'FillFieldStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style>
.FillFieldStep {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.FillFieldStep-selector {
    color: hsl(204, 86%, 53%);
}

.FillFieldStep-text {
    color: hsl(171, 100%, 41%);
}
</style>

