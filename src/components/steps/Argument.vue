<template>
  <b-tooltip
    :label="copyText"
    position="is-left"
    square
    size="is-small"
    type="is-dark"
  >
    <span @click="copy(arg)">
      {{ locatorArg }}
    </span>
  </b-tooltip>
</template>

<script>
// import {getSelectorString} from '../../services/selector';

export default {
  name: 'Argument',
  props: {
    arg: {
      type: [Object, String, Boolean, Number],
      required: true,
    }
  },
  data: function() {
    return {
      copyText: 'Copy'
    };
  },
  computed: {
    locatorArg: function() {
      if (typeof this.arg === 'object') return formatSelector(this.arg);
      return this.arg;
    }
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(this.arg);
      this.copyText = 'Copied!';
      setTimeout(() => this.copyText = 'Copy', 3000);
    },
  }
};

function formatSelector(stepArg) {
  if (typeof stepArg !== 'object') {
    return stepArg;
  }

  if (stepArg.output) {
    return `<${stepArg.output}>`;
  }
  if (stepArg.css) {
    return `css⇨${stepArg.css}`;
  }
  if (stepArg.xpath) {
    return `xpath⇨${stepArg.xpath}`;
  }
  return stepArg;
}

</script>
