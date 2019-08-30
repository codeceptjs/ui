<template>
    <div class="MetaStep columns is-gapless">
        <div class="column is-3 ellipsize">
            <strong class="StepMetaStep has-text-grey">
                {{actorFromMetaStep(step)}}
            </strong>
        </div>
        <div class="column">
            <strong class="StepMetaStep has-text-dark">
                {{methodFromMetaStep(step)}}
            </strong>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MetaStep',
    props: ['step'],
    methods: {
        actorFromMetaStep(step) {
        if (step.actor) {
            const actor = step.actor === 'Context:' ? step.name : step.actor;
            return actor;
        }
        return 'In Scenario';
        },

        methodFromMetaStep(step) {
        if (step.actor) {
            const name = step.actor === 'Context:' ? '' : step.name;
            return name;
        }
        return '';
        },
    }
}
</script>

<style>
.MetaStep {
  font-family: -apple-system,BlinkMacSystemFont,Lato,Helvetica Neue,sans-serif;
}
</style>


