<template>
    <div class="CommentStep">
        <strong class="Comment-Step-comment has-text-link">
            //
            {{step.args[0]}}
        </strong>
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
  margin-left: .2em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>


