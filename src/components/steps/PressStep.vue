<template>
    <div class="PressStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
        </div>
        <div class="column is-9">
            <span class="tag is-light">{{step.args[0]}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PressStep',
    props: ['step']
}
</script>

<style>
.PressStep {
    padding-left: .5em;
}
</style>


