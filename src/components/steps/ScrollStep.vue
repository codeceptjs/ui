<template>
    <div class="ScrollStep has-text-grey-light columns is-gapless">
      <div class="column is-3">
        <i class="Step-icon fa fa-sort-amount-down"></i> 
        {{step.humanized}} 
      </div>
      <div class="column is-9">
        <span class="ScrollStep-arg">{{formatSelector(step.args[0])}}</span>
      </div>
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
  margin-left: .2em;
  
}

.ScrollStep-arg {
}

</style>


