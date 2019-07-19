<template>
    <div class="RefreshPageStep has-text-grey">
        <i class="Step-icon fas fa-sync"></i> {{step.humanized}}
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
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
}
</style>


