<template>
    <div class="SaveScreenshotStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
            I {{step.humanized}}
        </div>
        <div class="column is-9">
            to "{{step.args[0]}}"
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


