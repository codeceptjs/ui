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
import copyToClipboard from 'copy-text-to-clipboard';

export default {
  name: 'Argument',
  props: {
    arg: {
      type: Object,
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
    copy() {
      copyToClipboard(this.arg);
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
