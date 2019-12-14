<template>
  <b-navbar>
    <template slot="brand">
      <Logo />
    </template>
    <template slot="burger">
      <b-navbar-item
        tag="div"
        v-if="this.$route.path !== '/settings'"
      >
        <RunButton @run="run()" />
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item>
        <SettingsMenu />
      </b-navbar-item>
      <b-navbar-item />
    </template>
  </b-navbar>
</template>

<script>
import SettingsMenu from './SettingsMenu';
import RunButton from './RunButton';
import Logo from './Logo';

export default {
  name: 'Header',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: { SettingsMenu, RunButton, Logo },
  methods: {
    run() {
      this.$emit('run');
    },

    gotoScenarios() {
      this.$router.push('/');
    }
  }
};
</script>

<style>
.fixed-width {
  display: inline-block;
  width: 1em;
}
.navbar {
  min-height: auto;
}
</style>


