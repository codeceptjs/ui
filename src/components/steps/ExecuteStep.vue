<template>
    <div class="ExecuteStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
            I {{step.humanized}}
        </div>
        <div class="column is-9 ellipsize">
            {{step.humanizedArgs}}
        </div>

    </div>
</template>

<script>
export default {
    name: 'ExecuteStep',
    props: ['step']
}
</script>

<style>
.ExecuteStep {
}


</style>


