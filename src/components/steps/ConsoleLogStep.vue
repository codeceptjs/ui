<template>
    <div class="ConsoleLogStep columns is-gapless">
        <div class="column is-3">
            <b-tag rounded :class="{ 'is-danger': step.logEntry.type === 'error' }">
                console {{step.logEntry.type}}
            </b-tag>
        </div>
        <div class="column ellipsize">
            {{step.logEntry.args}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConsoleLogStep',
    props: ['step']
}
</script>

<style>
.ConsoleLogStep {
}
</style>


