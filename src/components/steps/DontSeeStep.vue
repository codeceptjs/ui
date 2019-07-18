<template>
    <div class="DontSeeStep">
      <span class="tag is-success">
        assert
      </span>

      <span v-if="step.args.length == 1">
        {{step.humanized}} <span class="DontSeeStep-arg">{{formatSelector(step.args[0])}}</span>
      </span>
      <span v-else>
        {{step.humanized}} <span class="DontSeeStep-arg">{{step.args[0]}}</span>
      </span>
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


