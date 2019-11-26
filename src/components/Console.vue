<template>
    <section>
        <b-icon
                icon="home"
                size="is-large"
                type="is-info" />
            <b-collapse
                aria-id="contentIdForA11y2"
                class="panel"
                :open.sync="isOpen"
            >
                <div
                    slot="trigger"
                    class="panel-heading"
                    role="button"
                    aria-controls="contentIdForA11y2">
                    <i class="fas fa-terminal" />
                </div>
                <b-tabs v-model="activeTab" type="is-boxed" expanded>
                    <b-tab-item>
                        <template slot="header">
                            <div>
                                <span class="tab_header">Console</span>
                                <i class="fas fa-terminal" />
                            </div>
                        </template>
                        <template slot="default">
                            <div class="console-tab__content">
                                <span><i class="fas fa-bug" title="Error"/></span>
                                {{counterConsoleLogError}}
                            </div>
                            <div class="console-tab__content">
                                <span><i class="fas fa-info-circle" title="Info" /></span>
                                {{counterConsoleLogInfo}}
                            </div>
                            <div class="console-tab__content">
                                <span><i class="fas fa-box" title="AnyLog" /></span>
                                {{counterConsoleLog}}
                            </div>
                            <div class="console-tab__content">
                                <span><i class="fas fa-exclamation-triangle" title="Warn" /></span>
                                {{counterConsoleLogWarn}}
                            </div>
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
      name: "Console",
      data() {
        return {
          activeTab: 0,
          isOpen: false
        }
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
        }
      }
	}
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
  @apply .px-2 ;
 }
 .console-tab__content{
  display: flex;
  justify-content: space-between;
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
</style>
