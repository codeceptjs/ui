<template>
    <div class="PressStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
        </div>
        <div class="column is-9">
            <kbd class="PressStep-kbd has-background-grey-light">{{step.args[0]}}</kbd>
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
}

.PressStep-kbd {
    padding: .2rem .4rem;
    font-size: .6rem;
    color: #fff;
    background-color: #212529;
    border-radius: .2rem;
}
</style>


