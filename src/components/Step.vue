<template>
  <div class="StepContainer" 
    v-bind:class="{ 'StepContainer--selected': isSelected, 'StepContainer--failed': step.result === 'failed', 'StepContainer--passed': step.result === 'passed' }"
    v-on:click="handleSelectStep(step)">
    
    <div class="StepWrapper" v-if="isMetaStep(step)">
      <strong v-if="step.actor" class="StepMetaStep has-text-black">
        {{step.actor}}{{step.name}}
      </strong>
      <strong v-else class="StepMetaStep has-text-black">
        In Scenario
      </strong>
    </div>

    <div class="StepWrapper" v-else-if="stepNameIncludes('send')">
      <SendStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('switchTo')">
      <SwitchToStep v-bind:step="step" />
    </div>

    <div class="StepWrapper" v-else-if="stepNameStartsWith('scroll')">
      <ScrollStep v-bind:step="step" />
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

    <div class="StepWrapper" v-else-if="stepNameStartsWith('dontSee')">
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

    <div class="StepWrapper" v-else-if="stepNameStartsWith('comment')">
      <CommentStep v-bind:step="step" />
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

    <div class="StepDetails" v-if="isSelected">
      <i class="far fa-clock"></i> {{step.duration}}ms
      at {{getMethodFromStack(step.stack.stackFrameOfStep)}}
      &nbsp;
      <button v-if="step.stack.stackFrameOfStep" 
        class="StepDetails-open button is-info is-small is-outlined" 
        href="#" 
        v-on:click="openFileFromStack(step.stack.stackFrameOfStep)">
        Show
      </button>
      &nbsp;
      <button v-if="hasTestStackFrame(step.stack)" 
        class="StepDetails-open button is-info is-small is-outlined" 
        href="#" 
        v-on:click="openFileFromStack(step.stack.stackFrameInTest)">
        Show In Test
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
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
import CommentStep from './steps/CommentStep';
import SwitchToStep from './steps/SwitchToStep';
import ScrollStep from './steps/ScrollStep';

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
    CommentStep,
    SwitchToStep,
    ScrollStep,
  },
  methods: {
    isMetaStep(step) {
      return step.type === 'meta';
    },
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
    },

    getMethodFromStack: function (stackFrame) {
      const m = stackFrame.match(/at\s+([^\s]+)/)
      if (!m) return;
      return m[1];
    },

    openFileFromStack: function (stackFrame) {
      const m = stackFrame.match(/\s+\(([^)]+)/)
      if (m) {
        const filePath = m[1];
        axios.get(`/api/tests/${encodeURIComponent(filePath)}/open`);
      }
    },

    hasTestStackFrame: function (stack) {
      return stack.stackFrameInTest && stack.stackFrameInTest !== stack.stackFrameOfStep;
    },

    handleSelectStep: function (step) {
      if (this.isMetaStep(step)) return;
      this.$emit('select-step', step)
    }
  }
}
</script>

<style scoped>
.StepContainer {
  cursor: pointer;
  font-size: 0.9rem;
  font-family:  Inconsolata, monospace; 
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
  padding: .2em 0 .2em .5em;
}

.StepMetaStep {

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

.Step-argOther {
  margin-left: 0.5em;
  color:hsl(171, 100%, 41%)
}

.StepDetails {
  margin-left: 1em;
  padding: 5px;
  font-size: 0.8rem;
  font-family:  Inconsolata, monospace;
  line-height: 2em;
}


</style>
