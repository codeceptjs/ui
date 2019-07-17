<template>
  <div class="StepContainer" 
    v-bind:class="{ 'StepContainer--selected': isSelected, 'StepContainer--failed': step.result === 'failed', 'StepContainer--passed': step.result === 'passed' }"
    v-on:click="$emit('select-step', step)">
    
    <div class="StepWrapper" v-if="stepNameIncludes('send')">
      <SendStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('wait')">
      <WaitStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('click')">
      <ClickStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('fillField')">
      <FillFieldStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('see')">
      <SeeStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('dointSee')">
      <DontSeeStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('amOnPage')">
      <AmOnPageStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameIncludes('Cookie')">
      <CookieStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('refresh')">
      <RefreshPageStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('press')">
      <PressStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('execute')">
      <ExecuteStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('grab')">
      <GrabStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('saveScreenshot')">
      <SaveScreenshotStep v-bind:step="step" />
    </div>

    <div v-else class="StepWrapper">
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
import SendStep from './steps/SendStep';
import SeeStep from './steps/SeeStep';
import DontSeeStep from './steps/DontSeeStep';
import WaitStep from './steps/WaitStep';
import ClickStep from './steps/ClickStep';
import AmOnPageStep from './steps/AmOnPageStep';
import CookieStep from './steps/CookieStep';
import PressStep from './steps/PressStep';
import RefreshPageStep from './steps/RefreshPageStep';
import SaveScreenshotStep from './steps/SaveScreenshotStep';
import FillFieldStep from './steps/FillFieldStep';
import ExecuteStep from './steps/ExecuteStep';
import GrabStep from './steps/GrabStep';

export default {
  name: 'Step',
  props: ['step', 'selectedStep', 'isSelected', 'error'],
  components: {
    SendStep,
    SeeStep,
    DontSeeStep,
    WaitStep,
    ClickStep,
    AmOnPageStep,
    CookieStep,
    PressStep,
    RefreshPageStep,
    SaveScreenshotStep,
    FillFieldStep,
    ExecuteStep,
    GrabStep,
  },
  methods: {
    stepNameStartsWith(methodName) {
      const step = this.$props.step;
      return step.name.startsWith(methodName);
    },

    stepNameIncludes(methodName) {
      const step = this.$props.step;
      return step.name.includes(methodName);
    },

    getSelector: function (stepArgs) {
      const {label} = getSelectorString(stepArgs[0]);
      return label;
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
  font-size: 0.85em;
  font-family: monospace; 
}

.StepContainer--selected {
  background-color: #ddd;
}

.StepContainer--passed {
  border-left: 4px solid hsl(141, 71%, 48%);
}

.StepContainer--failed {
  border-left: 4px solid hsl(348, 100%, 61%);
}

.StepWrapper {
  padding-left: .5em;
}

.Step-icon {
  display: inline-block;
  width: 1em;
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
