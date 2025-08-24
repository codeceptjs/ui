<template>
  <div class="RuntimeModeIndicator">
    <b-tooltip
      :label="tooltipLabel"
      position="is-bottom"
      type="is-dark"
    >
      <b-tag
        :type="tagType"
        size="is-small"
        class="mode-indicator"
      >
        <i
          :class="iconClass"
          class="mr-1"
        />
        {{ modeText }}
      </b-tag>
    </b-tooltip>
  </div>
</template>

<script>
export default {
  name: 'RuntimeModeIndicator',
  computed: {
    isHeadless() {
      return this.$store.state.settings.isHeadless === true;
    },
    isHeaded() {
      return this.$store.state.settings.isHeadless === false;
    },
    modeText() {
      if (this.isHeadless) return 'Headless';
      if (this.isHeaded) return 'Window';
      return 'Default';
    },
    tagType() {
      if (this.isHeadless) return 'is-info';
      if (this.isHeaded) return 'is-success';
      return 'is-light';
    },
    iconClass() {
      if (this.isHeadless) return 'fas fa-ghost';
      if (this.isHeaded) return 'fas fa-window-maximize';
      return 'fas fa-browser';
    },
    tooltipLabel() {
      if (this.isHeadless) return 'Tests will run in headless mode (no browser window)';
      if (this.isHeaded) return 'Tests will run in window mode (browser visible)';
      return 'Tests will use default browser mode from config';
    }
  }
};
</script>

<style lang="scss" scoped>
.mode-indicator {
  cursor: help;
  font-weight: 500;
}
</style>