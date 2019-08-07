<template>
    <div class="ClickStep columns is-gapless">
        <div class="column is-3">
            I {{step.humanized}}
        </div>
        <div class="column is-9">
            <div v-if="step.args.length === 1">
                <span class="ClickStep-selector">
                    {{formatSelector(step.args[0])}}
                </span>
            </div>
            <div v-if="step.args.length === 2">
                <span class="ClickStep-text">
                    "{{step.args[0]}}"
                </span>
                <span class="ClickStep-selector">
                    {{formatSelector(step.args[1])}}
                </span>
            </div>
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
  margin-left: .2em;
}

.ClickStep-selector {
    color: hsl(204, 86%, 53%);
}

.ClickStep-text {
    color: hsl(171, 100%, 41%);
}
</style>


