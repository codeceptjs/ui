<template>
    <div class="FillFieldStep columns is-gapless">
        <div class="column is-3">
            I {{step.humanized}}
        </div>
        <div class="column is-9">
            <div class="FillFieldStep-selector">{{formatSelector(step.args[0])}}</div>
            <div class="FillFieldStep-text" v-if="step.args[1]">"{{step.args[1]}}"</div>
        </div>
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
}

.FillFieldStep-selector {
    color: hsl(204, 86%, 53%);
}

.FillFieldStep-text {
    color: hsl(171, 100%, 41%);
}
</style>

