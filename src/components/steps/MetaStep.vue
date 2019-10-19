<template>
    <div class="step">
    <i class="fas fa-chevron-down" :class="{ 'is-opened': isOpened }"></i>
        <strong class="StepMetaStep has-text-grey">
            {{actorFromMetaStep(step)}}
        </strong> 
        <strong class="StepMetaStep has-text-dark">
            {{methodFromMetaStep(step)}}
        </strong>
    </div>
</template>

<script>
export default {
    name: 'MetaStep',
    props: ['step','isOpened'],
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
.step i {  transition: 0.5s all; }
.is-opened {
  transform: rotate(-90deg);
}
</style>


