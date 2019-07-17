<template>
    <div class="ExecuteStep">
        <i class="Step-icon far fa-play-circle"></i> 
        {{step.humanized}}

        {{step.args[0]}}
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
  color: hsl(0, 0%, 71%);
}
</style>


