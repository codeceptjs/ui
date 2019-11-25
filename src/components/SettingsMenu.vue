<template>
  <b-dropdown position="is-bottom-left" aria-role="menu">
    <a class="navbar-item" slot="trigger" role="button">      
       <b-tooltip label="Window Mode Enabled" position="is-left" square type="is-dark">
        <i class="fa-lg fas fa-window-maximize settings" v-if="isHeaded"></i>
      </b-tooltip>
      <b-tooltip label="Headless Mode Enabled" position="is-left" square type="is-dark">
        <i class="fa-lg fas fa-ghost settings" v-if="isHeadless"></i>
      </b-tooltip>

      <i class="fa-lg fab fa-firefox settings" v-if="browser === 'firefox'"></i>
      <i class="fa-lg fab fa-chrome settings" v-if="browser === 'chrome'"></i>
      <i class="fa-lg fab fa-internet-explorer settings" v-if="browser === 'internet-explorer'"></i>
      <i class="fa-lg fab fa-edge settings" v-if="browser === 'edge'"></i>
      <i class="fa-lg fab fa-safari settings" v-if="browser === 'safari'"></i>


      <i class="fas fa-cog"></i>
    </a>

    <b-dropdown-item aria-role="menu-item" :focusable="false" custom paddingless>
      <form action>
        <div class="modal-card" style="width:300px;">
          <section class="modal-card-body">
            <p><b class="title is-size-6">Helpers</b></p>
            <p class="mb-4">
              <b-tag class="mr-1" v-for="helper of config.helpers" v-bind:key="helper">
                {{helper}}
              </b-tag>
            </p>

        <b-field label="Browser" horizontal>
            <b-autocomplete
                size="is-small"
                v-model="browser"
                :data="browsers"
                placeholder="use configured browser"
                @select="option => selected = option">
            </b-autocomplete>
        </b-field>

            <b-switch v-model="isHeadless">Force <b>Headless</b> Mode</b-switch>
            <p></p>
            <b-switch v-model="isHeaded">Force <b>Window</b> Mode</b-switch>
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
            <p class="mt-2"></p>
            <b-field label="Editor" horizontal>
              <b-input size="is-small" v-model="editor" type="text" placeholder="Code editor command"></b-input>
            </b-field>
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
import axios from 'axios';

export default {
  name: "SettingsMenu",
  data() {
    const { width, height } = this.$store.getters["settings/windowSize"];
    const { isHeadless, editor, browser } = this.$store.state.settings;
    const isHeaded = (isHeadless === false);
    return {
      browsers: [
        'chrome',
        'firefox',
        'edge',
        'safari',
        'internet explorer',
      ],
      config: {
        helpers: []
      },
      hasSize: !!(width || height),
      width,
      height,
      browser,
      editor,
      isHeadless,
      isHeaded,
    };
  },
  async created() {
    const config = await axios.get('/api/config');
    this.config = config.data;
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
    browser: function(browser) {
      this.$store.dispatch("settings/setBrowser", browser);
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
    },
    editor: function(editor) {
      this.$store.dispatch("settings/setEditor", editor);
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
  .fab.settings, .fas.settings {
    @apply text-purple-400 mr-1;
  }
</style>