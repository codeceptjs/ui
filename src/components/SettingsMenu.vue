<template>
  <b-dropdown
    position="is-bottom-left"
    aria-role="menu"
  >
    <a
      class="navbar-item"
      slot="trigger"
      role="button"
    >
      <b-tooltip
        label="Window Mode Enabled"
        position="is-left"
        square
        type="is-dark"
      >
        <i
          class="fa-lg fas fa-window-maximize settings"
          v-if="isHeaded"
        />
      </b-tooltip>
      <b-tooltip
        label="Headless Mode Enabled"
        position="is-left"
        square
        type="is-dark"
      >
        <i
          class="fa-lg fas fa-ghost settings"
          v-if="isHeadless"
        />
      </b-tooltip>

      <i
        class="fa-lg fab fa-firefox settings"
        v-if="browser === 'firefox'"
      />
      <i
        class="fa-lg fab fa-chrome settings"
        v-if="browser === 'chrome'"
      />
      <i
        class="fa-lg fab fa-internet-explorer settings"
        v-if="browser === 'internet-explorer'"
      />
      <i
        class="fa-lg fab fa-edge settings"
        v-if="browser === 'edge'"
      />
      <i
        class="fa-lg fab fa-safari settings"
        v-if="browser === 'safari'"
      />
      <i class="fas fa-cog" />
    </a>
    <b-dropdown-item
      aria-role="menu-item"
      :focusable="false"
      custom
      paddingless
    >
      <form action>
        <div
          class="modal-card"
          style="width:300px;"
        >
          <section class="modal-card-body">
            <p><b class="title is-size-6">Helpers</b></p>
            <p class="mb-4">
              <b-tag
                class="mr-1"
                v-for="helper of config.helpers"
                :key="helper"
              >
                {{ helper }}
              </b-tag>
            </p>
            <b-field
              label="Browser"
              horizontal
            >
              <b-autocomplete
                size="is-small"
                v-model="browser"
                :data="browsers"
                placeholder="use configured browser"
                @select="option => selected = option"
              />
            </b-field>
            <b-switch v-model="isSingleSession">
              Singleton Browser Session
            </b-switch>
            <p />
            <b-switch v-model="isHeadless">
              Force <b>Headless</b> Mode
            </b-switch>
            <p />
            <b-switch v-model="isHeaded">
              Force <b>Window</b> Mode
            </b-switch>
            <p />
            <b-switch v-model="hasSize">
              Window Size
            </b-switch>
            <p />
            <p />
            <div
              class="control columns"
              v-if="hasSize"
            >
              <div class="column">
                <input
                  class="input is-small inline-block"
                  v-model="width"
                  type="text"
                  placeholder="Width"
                >
              </div>
              <div class="column">
                <input
                  class="input is-small inline-block"
                  v-model="height"
                  type="text"
                  placeholder="Height"
                >
              </div>
            </div>
            <p class="mt-2" />
            <b-field
              label="Editor"
              horizontal
            >
              <b-input
                size="is-small"
                v-model="editor"
                type="text"
                placeholder="Code editor command"
              />
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <a
              class="is-small"
              @click="gotoSettingsPage()"
            >Show Config</a> &nbsp; {{ config.file }}
          </footer>
        </div>
      </form>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SettingsMenu',
  data() {
    const { width, height } = this.$store.getters['settings/windowSize'];
    const { editor, browser, isHeadless } = this.$store.state.settings;
    return {
      headlessMode: isHeadless,
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
    };
  },
  async created() {
    const config = await axios.get('/api/config');
    this.config = config.data;
  },
  computed: {
    isHeadless: {
      get() {
        return this.$store.state.settings.isHeadless === true;
      },
      set(isHeadless) {
        this.headlessMode = isHeadless ? true : null;
        this.setHeadlessSettings();
      },
    },
    isHeaded:  {
      get() {
        return this.$store.state.settings.isHeadless === false;
      },
      set(isHeaded) {
        this.headlessMode = isHeaded ? false : null;
        this.setHeadlessSettings();
      },
    },
    isSingleSession: {
      get() {
        return this.$store.state.settings.isSingleSession;
      },
      set(isSingleSession) {
        this.$store.dispatch('settings/setSingleSession', isSingleSession);
      }
    }
  },
  watch: {
    width: function(width) {
      if (!this.height) return;
      this.$store.dispatch('settings/setWindowSize', { width, height: this.height });
    },
    height: function(height) {
      if (!this.width) return;
      this.$store.dispatch('settings/setWindowSize', { width: this.width, height });
    },
    browser: function(browser) {
      this.$store.dispatch('settings/setBrowser', browser);
    },
    hasSize: function(hasSize) {
      if (!hasSize) {
        this.width = null;
        this.height = null;
      }
      this.$store.dispatch('settings/setWindowSize', { width: this.width, height: this.height });
    },
    editor: function(editor) {
      this.$store.dispatch('settings/setEditor', editor);
    },
  },
  methods: {
    setHeadlessSettings: function() {
      this.$store.dispatch('settings/setHeadless', this.headlessMode);
    },
    gotoSettingsPage() {
      this.$router.push('settings');
    }
  }
};
</script>
<style lang="scss" scoped>
  .fab.settings, .fas.settings {
    @apply text-purple-400 mr-1;
  }
</style>
