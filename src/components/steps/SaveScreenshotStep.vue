<template>
    <div class="SaveScreenshotStep has-text-grey-light">
        <i class="Step-icon fas fa-image"></i>&nbsp;<span>{{step.args[0]}}</span>
    </div>
</template>

<script>
export default {
    name: 'SaveScreenshotStep',
    props: ['step']
}
</script>

<style>
.SaveScreenshotStep {
    margin-left: .2em;
}
</style>


