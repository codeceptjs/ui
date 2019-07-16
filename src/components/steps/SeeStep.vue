<template>
    <div class="SeeStep">
        <span class="SeeStep-assert tag is-success is-small">
            assert
        </span>
        {{step.humanized}}
        <span class="Step-argSelector">{{getSelector(step.args)}}</span>
        <span class="Step-argOther" v-if="step.args[1]">{{toStringOrNumber(step.args[1])}}</span>
    </div>
</template>

<script>
export default {
    name: 'SeeStep',
    props: ['step'],
}
</script>

<style>
.SeeStep {
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.SeeStep-assert {
  padding: 2px;
}
</style>
