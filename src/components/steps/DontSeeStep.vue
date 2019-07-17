<template>
    <div class="DontSeeStep">
      <div v-if="step.args.length == 1">
        <i class="Step-icon far fa-eye-slash"></i> {{step.humanized}} <span class="DontSeeStep-arg">{{formatSelector(step.args[0])}}</span>
      </div>
      <div v-else>
        <i class="Step-icon far fa-eye-slash"></i> {{step.humanized}} <span class="DontSeeStep-arg">{{step.args[0]}}</span>
      </div>
    </div>
</template>

<script>
import {getSelectorString} from '../../services/selector';

export default {
    name: 'DontSeeStep',
    props: ['step'],
    methods: {
      formatSelector(sel) {
          return getSelectorString(sel).label;
      }
    }
}
</script>

<style>
.DontSeeStep {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: hsl(0, 0%, 71%);
}

.DontSeeStep-arg {
  color: hsl(0, 0%, 71%);
}

</style>


