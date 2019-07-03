<template>
  <div class="StepContainer" 
    v-bind:class="{ 'StepContainer--selected': isSelected, 'StepContainer--failed': step.result === 'failed', 'StepContainer--passed': step.result === 'passed' }"
    v-on:click="$emit('select-step', step)">
    
    <div 
      v-if="step.name.includes('send')" 
      class="Step-rest">
      <div>
        <span class="tag is-info">
          {{httpMethod}}
        </span>
        {{urlRearPart}}
      </div>
    </div>

    <div 
      v-else-if="isWaitStep" 
      class="Step-wait">
      <i class="fas fa-hourglass"></i> {{step.humanized}} <span class="Step-args">{{step.args[0]}}</span>

    </div>

    <div v-else class="Step">
      <div class="Step-name">
        I {{step.humanized}} <span class="Step-args">{{getSelector(step.args)}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  props: ['step', 'selectedStep', 'isSelected', 'error'],
  computed: {
    httpMethod: function () {
      const step = this.$props.step;

      if (step.name.includes('sendGet')) {
        return 'get';
      }
      if (step.name.includes('sendPut')) {
        return 'put';
      }
      if (step.name.includes('sendPost')) {
        return 'post';
      }
      if (step.name.includes('sendDelete')) {
        return 'delete';
      }
      return 'unknown';
    },

    urlRearPart: function () {
      const step = this.$props.step;
      let url = step.args[0];
      if (!url) return;
      url = new URL(url);

      return '...' + url.pathname.slice(-40);
    },

    isWaitStep: function () {
      const step = this.$props.step;
      return step.name.indexOf('wait') === 0;
    }
  },
  methods: {
    getSelector: function (stepArgs) {
      const first = stepArgs[0];

      if (typeof first === 'object') {
        return first.output || first;
      }
      return `"${first}"`;
    }
  }
}
</script>

<style scoped>
.StepContainer {
  cursor: pointer;
  font-size: 0.9em;
}

.StepContainer--selected {
  background-color: #ddd;
}

.StepContainer--passed {
  border-left: 3px solid hsl(141, 71%, 48%);
}

.StepContainer--failed {
  border-left: 3px solid hsl(348, 100%, 61%);
}

.Step {
  padding: 3px 5px;
  color: #4f5959;
}

.Step-rest {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.Step-wait {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: hsl(0, 0%, 71%);
}

.Step-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.Step-args {
  color: hsl(204, 86%, 53%);
}
</style>
