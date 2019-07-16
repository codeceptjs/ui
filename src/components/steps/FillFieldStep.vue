<template>
    <div class="FillFieldStep">
        I {{step.humanized}}
        <span class="Step-argSelector">{{getSelector(step.args)}}</span>
        <span class="Step-argOther" v-if="step.args[1]">{{toStringOrNumber(step.args[1])}}</span>
    </div>

</template>

<script>
export default {
    name: 'FillFieldStep',
    props: ['step']
}
</script>

