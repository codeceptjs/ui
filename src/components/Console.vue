<template>
  <section>
    <b-icon
      icon="home"
      size="is-large"
      type="is-info"
    />
    <b-collapse
      aria-id="contentIdForA11y2"
      class="panel"
      :open.sync="isOpen"
    >
      <div
        slot="trigger"
        class="panel-heading"
        role="button"
        aria-controls="contentIdForA11y2"
      >
        <i class="fas fa-terminal" />
        <span> Current test name: "{{ getCurrentTest.title }}" </span>
      </div>
      <b-tabs
        v-model="activeTab"
        type="is-boxed"
        expanded
      >
        <b-tab-item>
          <template slot="header">
            <div class="console-tab__content">
              <div>
                <b-tooltip
                  label="Error"
                  position="is-right"
                >
                  <i
                    class="fas fa-bug"
                    title="Error"
                  />
                  <b-tag rounded>
                    {{ counterConsoleLogError }}
                  </b-tag>
                </b-tooltip>
              </div>
              <div>
                <b-tooltip
                  label="Info"
                  position="is-right"
                >
                  <i
                    class="fas fa-info-circle"
                    title="Info"
                  />
                  <b-tag rounded>
                    {{ counterConsoleLogInfo }}
                  </b-tag>
                </b-tooltip>
              </div>
              <div>
                <b-tooltip
                  label="Console.log"
                  position="is-right"
                >
                  <i
                    class="fas fa-box"
                    title="AnyLog"
                  />
                  <b-tag rounded>
                    {{ counterConsoleLog }}
                  </b-tag>
                </b-tooltip>
              </div>
              <div>
                <b-tooltip
                  label="Warn"
                  position="is-right"
                >
                  <i
                    class="fas fa-exclamation-triangle"
                    title="Warn"
                  />
                  <b-tag rounded>
                    {{ counterConsoleLogWarn }}
                  </b-tag>
                </b-tooltip>
              </div>
            </div>
          </template>
          <template slot="default">
            <!--         content                   -->
            <ul class="list_logs">
              <li
                v-for="itemLog in logList"
                :key="itemLog.id"
              >
                <p>
                  <i :class="formatIcon(itemLog.type)" />
                  <span>Message: {{ itemLog.message }}</span>
                </p>
              </li>
            </ul>
            <!--         content                   /-->
          </template>
        </b-tab-item>
        <b-tab-item>
          <template slot="header">
            <div>
              <span class="tab_header">Cookies</span>
              <i class="fas fa-cookie-bite" />
            </div>
          </template>
        </b-tab-item>
      </b-tabs>
    </b-collapse>
  </section>
</template>

<script>
export default {
  name: 'Console',
  data() {
    return {
      activeTab: 0,
      isOpen: false
    };
  },
  computed : {
    counterConsoleLogError () {
      return this.$store.getters['testRuns/errorTypeCounter']('error') ;
    },
    counterConsoleLogInfo () {
      return this.$store.getters['testRuns/errorTypeCounter']('info');
    },
    counterConsoleLog () {
      return this.$store.getters['testRuns/errorTypeCounter']('log');
    },
    counterConsoleLogWarn() {
      return this.$store.getters['testRuns/errorTypeCounter']('warn');
    },
    logList () {
      return this.$store.getters['testRuns/logsList'];
    },
    getCurrentTest () {
      return this.$store.getters['testRuns/currentTest'];
    }
  },
  methods: {
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
 .collapse-content {
  background-color: #dbdbdb;
 }
 .panel-heading {
  background-color: #dbdbdb;
 }
 .pannel {
     width: 66%;
 }
 .collapse {
  background-color: #fafafa;
 }
 .tab_header {
  padding-left: 5px;
 }
 .b-tabs {
  height: 200px;
 }
 .fas {
  @apply .px-2 .mx-3;
  margin-top: 3px;
 }
 .console-tab__content{
  display: flex;
 }
 .fa-bug {
  @apply .text-red-600;
 }
 .fa-info-circle {
  @apply .text-teal-300;
 }
 .fa-exclamation-triangle {
  @apply .text-orange-500;
 }
 .b-tabs .tab-content {
  border-bottom: 1px solid;
 }
</style>
