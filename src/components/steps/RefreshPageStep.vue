<template>
    <div class="RefreshPageStep">
        <i class="Step-icon fas fa-sync"></i> {{step.humanized}}
    </div>
</template>

<script>
export default {
    name: 'RefreshPageStep',
    props: ['step']
}
</script>

