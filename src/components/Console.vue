<template>
  <section>
    <b-collapse
      aria-id="contentIdForA11y2"
      :open.sync="isOpen"
    >
      <div
        v-if="step.logs && step.logs.length"
        slot="trigger"
        class="panel-heading"
        role="button"
        aria-controls="contentIdForA11y2"
      >
        <div>
          <b-tooltip
            label="Console"
            position="is-right"
          >
            <b-tag>
              <i
                class="fas fa-info-circle "
                title="Console Logs"
              />
              &nbsp;<b>{{ step.logs.length }}</b>
            </b-tag>
          </b-tooltip>
        </div>
      </div>
      <b-tabs
        v-model="activeTab"
        type="is-boxed"
        expanded
      >
        <b-tab-item>
          <template slot="default">
            <!--         content                   -->
            <ul class="log">
              <li
                :class="itemLog.type"
                v-for="itemLog in step.logs"
                :key="itemLog.id"
              >
                <i :class="formatIcon(itemLog.type)" />

                <span>{{ itemLog.message }}</span>
                @
                {{ itemLog.url }}

                <span class="float-right">{{ duration(itemLog) }}</span>
              </li>
            </ul>
            <!--         content                   /-->
          </template>
        </b-tab-item>
      </b-tabs>
    </b-collapse>
  </section>
</template>

<script>
export default {
  name: 'Console',
  props: {
    step: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      activeTab: 0,
      isOpen: false
    };
  },
  computed : {
    getCurrentTest () {
      return this.$store.getters['testRuns/currentTest'];
    },
  },
  methods: {
    duration(log) {
      if (!log.time || !this.step.startedAt) return '';
      return (log.time - this.step.startedAt) + 'ms';
    },
    formatIcon: (type = 'log') => {
      const iconTypesClass = {
        error: 'fas fa-bug',
        info: 'fas fa-info-circle',
        log: 'fas fa-box',
        warn: 'fas fa-exclamation-triangle'
      };
      return iconTypesClass[type];
    },
  },
};
</script>

<style lang="scss" scoped>
  section {
    @apply bottom-0 fixed;
    width: 66%;
  }
  .collapse .collapse-content {
    background: #fff;
    .b-tabs {
      background: #fff;
    }
  }
  .panel-heading {
    border: none;
    background: transparent;
  }

  .log li {    
    @apply border-b border-gray-200 border-solid text-sm;
    i {
      @apply mr-5;
    }
    &.error {
      @apply text-red-500;
    }
  }

  .tab_header {
    padding-left: 5px;
  }
  .b-tabs {
    height: 200px;
  }
  .tabs {
    .is-active {
      background: #fff;
    }
    li {
      @apply bg-gray-200;

    }
  }
  .fas {
  }
  .console-tab__content{
    display: flex;
  }
  .fa-bug {
    @apply .text-red-600;
  }
  .fa-info-circle {
    @apply .text-orange-500;
  }
  .fa-exclamation-triangle {
    @apply .text-orange-500;
  }
  .b-tabs .tab-content {
    border-bottom: 1px solid;
  }
</style>
