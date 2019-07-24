<template>
    <div class="ClickStep">
        <div v-if="step.args.length === 1">
            I {{step.humanized}}
            <span class="ClickStep-selector">
                {{formatSelector(step.args[0])}}
            </span>
        </div>
        <div v-if="step.args.length === 2">
            I {{step.humanized}}
            <span class="ClickStep-text">
                "{{step.args[0]}}"
            </span>
            <span class="ClickStep-selector">
                {{formatSelector(step.args[1])}}
            </span>
        </div>
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'ClickStep',
    props: ['step'],
    methods: {
        formatSelector(sel) {
            return getSelectorString(sel).label;
        }
    }
}
</script>

<style>
.ClickStep {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ClickStep-selector {
    color: hsl(204, 86%, 53%);
}

.ClickStep-text {
    color: hsl(171, 100%, 41%);
}
</style>


