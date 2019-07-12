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
      <i class="fas fa-hourglass"></i> {{step.humanized}} <span>{{step.args[0]}}</span>
    </div>

    <div 
      v-else-if="isPressKeyStep" 
      class="Step-pressKey">
      <i class="fas fa-keyboard"></i>&nbsp;<span>{{step.args[0]}}</span>
    </div>

    <div 
      v-else-if="isSaveScreenshotStep" 
      class="Step-saveScreenshot">
      <i class="fas fa-image"></i>&nbsp;<span>{{step.args[0]}}</span>
    </div>

    <div class="Step-see"
      v-else-if="isSeeStep" 
    >
        <span class="tag is-success">
          assert
        </span>
        {{step.humanized}}
        <span class="Step-argSelector">{{getSelector(step.args)}}</span>
        <span class="Step-argOther" v-if="step.args[1]">{{toStringOrNumber(step.args[1])}}</span>
    </div>

    <div v-else-if="isAmOnPageStep" class="Step-amOnPage">
      I {{step.humanized}}
      <a class="Step-argUrl" :href="step.args[0]">{{step.args[0]}}</a>
    </div>

    <div v-else class="Step">
      <div class="Step-name">
        I {{step.humanized}}
        <span class="Step-argSelector">{{getSelector(step.args)}}</span>
        <span class="Step-argOther" v-if="step.args[1]">{{toStringOrNumber(step.args[1])}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {getSelectorString} from '../services/selector';

const trunc = (str, maxlen) => {
  if (str.length > maxlen) {
    return str.slice(1, maxlen) + '...';
  }
  return str;
}

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
    },

    isPressKeyStep: function () {
      const step = this.$props.step;
      return step.name.indexOf('pressKey') === 0;
    },

    isAmOnPageStep: function () {
      const step = this.$props.step;
      return step.name.startsWith('amOnPage');
    },

    isSeeStep: function () {
      const step = this.$props.step;
      return step.name.indexOf('see') === 0;
    },

    isSaveScreenshotStep: function () {
      const step = this.$props.step;
      return step.name.indexOf('saveScreenshot') === 0;
    }
  },
  methods: {
    getSelector: function (stepArgs) {
      const {label} = getSelectorString(stepArgs[0]);
      return trunc(label, 20);
    },

    toStringOrNumber: function (stringOrNumber) {
      if (typeof stringOrNumber === 'number') return stringOrNumber;
      return `"${stringOrNumber}"`
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

.Step-pressKey {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: hsl(0, 0%, 71%);
}

.Step-see {
  padding: 2px 5px;
}

.Step-saveScreenshot {
  font-size: 0.8em;
  margin-left: 1em;
  color: hsl(0, 0%, 71%);
  padding: 2px 5px;
}

.Step-amOnPage {
  padding: 2px 5px;
}

.Step-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.Step-argSelector {
  margin-left: 0.5em;
  color: hsl(204, 86%, 53%);
}

.Step-argUrl {
  display: inline;
  margin-left: 0.5em;
  color:hsl(171, 100%, 41%)
}

.Step-argOther {
  margin-left: 0.5em;
  color:hsl(171, 100%, 41%)
}
</style>
