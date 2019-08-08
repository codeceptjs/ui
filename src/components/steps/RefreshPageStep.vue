<template>
    <div class="RefreshPageStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
            <i class="Step-icon fas fa-sync"></i>
        </div>
        <div class="column">
            refresh
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
    padding-left: .5em;
}
</style>


