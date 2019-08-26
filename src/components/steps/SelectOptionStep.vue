<template>
    <div class="SelectOptionStep columns is-gapless">
        <div class="column is-3">
            I {{step.humanized}}
        </div>
        <div class="column is-9">
            <span class="SelectOptionStep-selector">{{formatSelector(step.args[0])}}</span>
            value
            <span class="SelectOptionStep-text" v-if="step.args[1]">"{{step.args[1]}}"</span>
        </div>
    </div>

</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'SelectOptionStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style>
.SelectOptionStep {
}

.SelectOptionStep-selector {
    color: hsl(204, 86%, 53%);
}

.SelectOptionStep-text {
    color: hsl(171, 100%, 41%);
}
</style>

