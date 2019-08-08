<template>
    <div class="ExecuteStep has-text-grey-light columns is-gapless">
        <div class="column is-3">
            <i class="Step-icon far fa-play-circle"></i> 
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
    padding-left: .5em;
}

.ellipsize {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>


