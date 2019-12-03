<template>
  <div
    class="StepContainer"
    :class="{ 
      'StepContainer--selected': isSelected, 
      'StepContainer--failed': isFailed, 
      'StepContainer--passed': isPassed,
      'StepContainer--pending': isPending,
    }"
    @click="handleSelectStep(step)"
  >
    <div
      class="StepWrapper"
      v-if="isMetaStep"
    >
      <MetaStep :step="step" />
    </div>

    <div
      class="StepWrapper"
      v-else-if="isCommentStep"
    >
      <div class="step comment">
        {{ step.args[0] }}
      </div>
    </div>
    <div
      class="StepWrapper"
      v-else
    >
      <div
        class="step"
        :class="{
          tech: isTechnicalStep,
          assert: isAssertionStep,
          wait: isWaiterStep,
          grab: isGrabberStep,
        }"
      >
        <span
          class="open-in-editor"
          v-if="step.stack"
        >
          <a
            v-if="step.stack.stackFrameOfStep && step.stack.stackFrameOfStep !== step.stack.stackFrameInTest"
            @click="openFileFromStack(step.stack.stackFrameOfStep)"
          ><i class="far fa-edit" /></a>
          <a
            v-else-if="step.stack.stackFrameInTest"
            @click="openFileFromStack(step.stack.stackFrameInTest)"
          ><i class="far fa-edit" /></a>
        </span>
        <i
          class="fas fa-circle-notch fa-spin pending-icon"
          v-if="isPending"
        />

        <span
          class="duration"
          v-if="step.duration"
        ><b>{{ step.duration }}</b>ms</span>
        <i
          class="fas fa-info-circle console"
          v-if="step.logs.length"
        />
        <GrabberStep
          :step="step"
          v-if="isGrabberStep"
        />
        <WaiterStep
          :step="step"
          v-else-if="isWaiterStep"
        />
        <AssertionStep
          :step="step"
          v-else-if="isAssertionStep"
        />
        <ActionStep
          :step="step"
          v-else-if="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ActionStep from './steps/ActionStep';
import AssertionStep from './steps/AssertionStep';
import GrabberStep from './steps/GrabberStep';
import WaiterStep from './steps/WaiterStep';
import MetaStep from './steps/MetaStep';
import { getSelectorString } from '../services/selector';

export default {
  name: 'Step',
  props: {
    step: {
      type: Object,
      required: true,
    },
    isHovered: {
      type: Boolean,
      required: false,
    },
    isSelected: {
      type: Boolean,
      required: false,
    },
    isOpened: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    GrabberStep,
    ActionStep,
    AssertionStep,
    WaiterStep,
    MetaStep,
  },

  computed: {
    isAction() {
      return ['click', 'clickLink', 'fillField', 'selectOption'].this.includes(this.step.name);
    },

    isCodeceptStep() {
      return this.step.type === undefined;
    },

    isMetaStep() {
      return this.step.type === 'meta';
    },

    isCommentStep() {
      return this.step.type === 'comment';
    },

    isPending() {
      return this.step.status === 'queued';
    },
    isPassed() {
      return this.step.status === 'success';
    },
    isFailed() {
      return this.step.status === 'failed';
    },      

    isAssertionStep() {
      return this.step.name.startsWith('see') || this.step.name.startsWith('dontSee');
    },

    isWaiterStep() {
      return this.step.name.startsWith('wait');
    },

    isGrabberStep() {
      return this.step.name.startsWith('grab');
    },


    isTechnicalStep() {
      return this.step.name.includes('Cookie')
        || this.step.name.startsWith('press')
        || this.step.name.includes('Screenshot')
        || this.step.name.startsWith('send')
        || this.step.name.startsWith('execute')
        || this.step.name.startsWith('scroll')
        || this.step.name.startsWith('refresh');
    },
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

    getSelectorLabel: function (stepArgs) {
      const {label} = getSelectorString(stepArgs[0]);
      return label;
    },

    getSelectorValue: function (stepArgs) {
      const {value} = getSelectorString(stepArgs[0]);
      return value;
    },

    toStringOrNumber: function (stringOrNumber) {
      if (typeof stringOrNumber === 'number') return stringOrNumber;
      return `"${stringOrNumber}"`;
    },

    getMethodFromStack: function (stackFrame) {
      if (!stackFrame) return '<stackframe not available>';
      const m = stackFrame.match(/at\s+([^\s]+)/);
      if (!m) return;
      return m[1];
    },

    openFileFromStack: function (stackFrame) {
      const m = stackFrame.match(/\s+\(([^)]+)/);
      if (m) {
        const filePath = m[1];
        axios.get(`/api/tests/${encodeURIComponent(filePath)}/open`);
      }
    },

    handleSelectStep: function (step) {
      if (this.isMetaStep) return;
      this.$emit('select-step', step);
    }
  }
};
</script>


<style lang="scss">
  .step {
    color: #000;
    @apply bg-white shadow p-1;

    &.comment {
      font-weight: bold;
      @apply text-blue-700 bg-gray-100;
    }
    &.action {
      @apply bg-white;
    }
    &.assert {
      @apply bg-green-100;
    }
    &.tech {
      @apply text-gray-500 bg-gray-100;
    }
    &.grab {
      @apply bg-pink-100;
    }
    &.wait {
      @apply text-gray-500 bg-orange-200;
    }

    .duration {
      @apply text-xs text-gray-500 float-right;
    }

    .console {
      @apply text-sm text-orange-400 float-right mr-1;
    }

    .pending-icon {
      @apply float-right ml-1 text-gray-500;
    }

    .open-in-editor {
      @apply text-xs float-right ml-1;
      a {
        @apply text-gray-500;
        &:hover {
          @apply text-gray-700;
        }
      }
    }

    .arguments > span {
      color: hsl(204, 86%, 53%);
      display: inline-block;
      vertical-align: bottom;
      @apply text-blue-600 border-blue-400;
      padding: 0;
      margin-right: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        overflow: visible;
      }

      &:nth-of-type(2) {
        @apply text-orange-600 border-orange-600;
      }
      &:nth-of-type(3) {
        @apply border-green-600 text-green-600;
      }
      &:nth-of-type(4) {
        @apply border-red-400;
      }
    }


  }



.StepContainer {
  position: relative;
  cursor: pointer;
  font-size: 0.9rem;
  font-family:  Inconsolata, monospace;
  overflow: hidden;
}

.StepContainer--selected {
  @apply .bg-indigo-500;
}

.StepContainer--passed {
  @apply border-solid border-green-500 border-r-4;
}

.StepContainer--failed {
  @apply border-solid border-red-500 border-r-4;
}

.StepContainer--pending {
  @apply border-solid border-yellow-500 border-r-4;
}

.step-details {
  @apply p-1;
}

.StepHoverContainer-content {
  padding: 3px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border-radius: 3px;
}

.StepHoverContainer-content > button {
  margin-left: .2rem;
}

.StepWrapper {
  padding: .2em 0 .2em 0;
}


.GenericStep {
}

.Step-argSelector {
  color: hsl(204, 86%, 53%);
}

.Step-argOther {
  color:hsl(171, 100%, 41%)
}

.StepDetails {
  width: 10em;
  font-size: 0.8rem;
  font-family:  Inconsolata, monospace;
  line-height: 2em;
  background-color: white;
  z-index: 10;
}


</style>
