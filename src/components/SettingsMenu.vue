<template>
  <b-dropdown position="is-bottom-left" aria-role="menu">
    <a class="navbar-item" slot="trigger" role="button">
       <b-tooltip label="Window Mode Enabled" position="is-left" square type="is-dark">
        <i class="fas fa-window-maximize settings" v-if="isHeaded"></i>
      </b-tooltip>
      <b-tooltip label="Headless Mode Enabled" position="is-left" square type="is-dark">
        <i class="fas fa-window-close settings" v-if="isHeadless"></i>
      </b-tooltip>
      <i class="fas fa-cog"></i>
    </a>

    <b-dropdown-item aria-role="menu-item" :focusable="false" custom paddingless>
      <form action>
        <div class="modal-card" style="width:300px;">
          <section class="modal-card-body">
            <h3 class="title is-size-6">Settings</h3>
            <b-switch v-model="isHeadless">Force <b>Headless</b> Mode</b-switch>
            <p></p>
            <b-switch v-model="isHeaded">Force <b>Window</b> Mode</b-switch>
            <p></p>
            <b-switch v-model="hasSize">Window Size</b-switch>
            <p></p>
            <p></p>
              <div class="control columns" v-if="hasSize">
                <div class="column">
                  <input class="input is-small inline-block" v-model="width" type="text" placeholder="Width">
                </div>
                <div class="column">
                  <input class="input is-small inline-block" v-model="height" type="text" placeholder="Height">
                </div>
              </div>
            <p></p>
            <hr>
            <label class="is-size-6">Code editor command line
              <input class="input is-small inline-block" v-model="editor" type="text" placeholder="Code editor command">
            </label>
          </section>
          <footer class="modal-card-foot">
            <a class="is-small" @click="gotoSettingsPage()">Configure all settings ...</a>
          </footer>
        </div>
      </form>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "SettingsMenu",
  data() {
    const { width, height } = this.$store.getters["settings/windowSize"];
    const isHeadless = this.$store.getters["settings/isHeadless"];
    const isHeaded = (isHeadless === false);
    return {
      hasSize: !!(width || height),
      width,
      height,
      editor: 'code --goto',
      isHeadless,
      isHeaded,
    };
  },
  watch: {
    width: function(width) {
      if (!this.height) return;
      this.$store.dispatch("settings/setWindowSize", { width, height: this.height });
    },
    height: function(height) {
      if (!this.width) return;
      this.$store.dispatch("settings/setWindowSize", { width: this.width, height });
    },
    hasSize: function(hasSize) {
      if (!hasSize) {
        this.width = null;
        this.height = null;
      }
      this.$store.dispatch("settings/setWindowSize", { width: this.width, height: this.height });
    },
    isHeaded: function(isHeaded) {
      if (isHeaded) this.isHeadless = false;
      this.setHeadlessSettings();
    },    
    isHeadless: function(isHeadless) {
      if (isHeadless) this.isHeaded = false;
      this.setHeadlessSettings();
    }
  },  
  methods: {
    setHeadlessSettings: function() {
      let val;
      if (this.isHeaded) val = false;
      if (this.isHeadless) val = true;
      if (!this.isHeaded && !this.isHeadless) val = null;
      this.$store.dispatch("settings/setHeadless", val);
    },
    gotoSettingsPage() {
      this.$router.push("settings");
    }
  }
};
</script>
<style lang="scss" scoped>
  .fas.settings {
    @apply text-indigo-400 mr-1;
  }
</style>