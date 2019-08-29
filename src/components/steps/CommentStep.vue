<template>
    <div class="CommentStep columns is-gapless has-text-info is-family-sans-serif">
        <div class="column is-narrow">
            <i class="CommentStep-icon far fa-comments"></i>
        </div>
        <div class="column">
           {{step.args[0]}}
        </div>
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
  padding-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
}

.CommentStep-icon {
  display: inline-block;
  width: 1.5rem;
}

</style>


