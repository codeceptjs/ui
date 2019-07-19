<template>
    <div class="SaveScreenshotStep has-text-grey">
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
    font-size: 0.8em;
    margin-left: 1em;
    padding: 2px 5px;
}
</style>


