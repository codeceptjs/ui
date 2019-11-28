<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }"
      >
        <img
          src="../assets/logo.png"
          alt="CodeceptUI"
        >
        &nbsp; CodeceptUI
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item>
        <RunButton @run="run()" />
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item>
        <SettingsMenu />
      </b-navbar-item>
      <bar-navbar-item />
    </template>
  </b-navbar>
</template>

<script>
import SettingsMenu from './SettingsMenu';
import RunButton from './RunButton';

export default {
  name: 'Header',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: { SettingsMenu, RunButton },
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


