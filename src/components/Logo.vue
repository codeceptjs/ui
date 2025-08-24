<template>
  <b-navbar-item
    tag="router-link"
    :to="{ path: '/' }"
    class="logo-home-button"
    title="Go to Home / Test Scenarios"
  >
    <div class="logo-container">
      <img
        src="../assets/logo.png"
        alt="CodeceptUI - Home"
      >
      <span class="brand hide-on-small">CodeceptUI</span>
      <span class="home-hint hide-on-wide">
        <i class="fas fa-home" />
      </span>
    </div>

    <b-dropdown
      class="hide-on-small"
      hoverable
      aria-role="list"
    >
      <b-taglist
        class="ml-1 text-xs"
        attached
        slot="trigger"
      >
        <b-tag type="is-light">
          {{ status }}
        </b-tag>
        <b-tag type="is-warning">
          {{ version }}
        </b-tag>
        <b-tag type="is-light">
          CodeceptJS
        </b-tag>
        <b-tag type="is-warning">
          {{ codeceptjsVersion }}
        </b-tag>
      </b-taglist>
      <b-dropdown-item aria-role="listitem">
        <a
          href="https://codecept.io"
          target="_blank"
          @click="openUrl('https://codecept.io')"
        >Open CodeceptJS &raquo;</a>
      </b-dropdown-item>

      <b-dropdown-item aria-role="listitem">
        <a
          target="_blank"
          href="https://github.com/codeceptjs/ui/issues"
          @click="openUrl('https://github.com/codeceptjs/ui/issues')"
        >GitHub issues  &raquo;</a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a
          href="https://github.com/codeceptjs/ui"
          target="_blank"
          @click="openUrl('https://github.com/codeceptjs/ui')"
        >Contribute to CodeceptUI &raquo;</a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a
          href="https://bit.ly/chat-codeceptjs"
          @click="openUrl('https://bit.ly/chat-codeceptjs')"
        >Join chat &raquo;</a>
      </b-dropdown-item>
    </b-dropdown>
  </b-navbar-item>
</template>

<script>
const { version } = require('../../package.json');
const { version: codeceptjsVersion } = require('codeceptjs/package.json');

export default {
  data() {
    return {
      status: 'beta',
      version,
      codeceptjsVersion,
    };
  },

  methods: {
    openUrl(url) {
      window.open(url);
    }
  }
};
</script>

<style lang="scss" scoped>
  .logo-home-button {
    transition: background-color 0.2s ease;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
    position: relative;
  }

  .brand {
    font-weight: bold;
    @apply text-gray-600 text-xl ml-2 mr-4;
  }

  .home-hint {
    @apply text-gray-500 text-sm ml-1;
    opacity: 0.7;
  }

  // Make it clear this is clickable on small screens
  @media (max-width: 600px) {
    .logo-home-button::after {
      content: "Home";
      @apply text-xs text-gray-500;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0.8;
    }
  }
</style>
