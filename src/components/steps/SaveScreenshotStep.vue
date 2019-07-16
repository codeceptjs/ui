<template>
    <div class="SaveScreenshotStep">
        <i class="Step-icon fas fa-image"></i>&nbsp;<span>{{step.args[0]}}</span>
    </div>
</template>

<script>
export default {
    name: 'SaveScreenshotStep',
    props: ['step']
}
</script>

