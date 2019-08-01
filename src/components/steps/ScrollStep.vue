<template>
    <div class="ScrollStep has-text-grey">
        <i class="Step-icon fa fa-sort-amount-down"></i> {{step.humanized}} <span class="ScrollStep-arg has-text-info">{{step.args[0]}}</span>
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'ScrollStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style>
.ScrollStep {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ScrollStep-arg {
}

</style>


