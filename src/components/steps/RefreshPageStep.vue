<template>
    <div class="RefreshPageStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
            I {{step.humanized}}
        </div>
        <div class="column">
        </div>
    </div>
</template>

<script>
export default {
    name: 'RefreshPageStep',
    props: ['step']
}
</script>

<style>
.RefreshPageStep {
}
</style>


