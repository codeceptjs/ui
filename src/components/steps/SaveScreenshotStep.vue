<template>
    <div class="SaveScreenshotStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
            <i class="Step-icon fas fa-image"></i>
        </div>
        <div class="column is-9">
            <span>{{step.args[0]}}</span>
        </div>
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
}
</style>


