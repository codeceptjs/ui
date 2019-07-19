<template>
    <div class="PressStep has-text-grey">
        <i class="Step-icon fas fa-keyboard"></i>&nbsp;<span>{{step.args[0]}}</span>
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
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>


