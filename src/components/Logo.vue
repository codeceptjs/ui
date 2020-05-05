<template>
  <b-navbar-item
    tag="router-link"
    :to="{ path: '/' }"
  >
    <img
      src="../assets/logo.png"
      alt="CodeceptUI"
    ><span class="hide-on-small">CodeceptUI</span> 

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
      </b-taglist>
      <b-dropdown-item aria-role="listitem">
        <a
          href="https://codecept.io"
          target="_blank"
        >Open CodeceptJS &raquo;</a>
      </b-dropdown-item>

      <b-dropdown-item aria-role="listitem">
        <a
          target="_blank"
          href="https://github.com/codecept-js/ui/issues"
        >GitHub issues  &raquo;</a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a
          href="https://github.com/codecept-js/ui"
          target="_blank"
        >Contribute to CodeceptUI &raquo;</a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a href="http://bit.ly/chat-codeceptjs">Join chat &raquo;</a>
      </b-dropdown-item>
    </b-dropdown>
  </b-navbar-item>
</template>

<script>
const version = require('../../package.json').version;

export default {
  data() {
    return {
      status: 'beta',
      version,
    };
  }
};
</script>

<style lang="scss" scoped>
  @media (max-width: 600px) { 
    .hide-on-small {
      display: none;
    }
  }
</style>