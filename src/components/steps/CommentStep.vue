<template>
  <div class="step CommentStep">
      {{step.args[0]}}
  </div>
</template>

<script>
export default {
    name: 'CommentStep',
    props: ['step']
}
</script>
<style>
.CommentStep {
  font-family: -apple-system,BlinkMacSystemFont,Lato,Helvetica Neue,sans-serif;
  font-weight: bold;
  @apply text-blue-500 bg-gray-100;  
}
</style>


