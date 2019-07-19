<template>
    <div class="ExecuteStep has-text-grey">
        <i class="Step-icon far fa-play-circle"></i> 
        {{step.humanized}}

        {{step.humanizedArgs}}
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
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>


