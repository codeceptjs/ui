<template>
  <b-navbar 
    fixed-top
  >
    <template slot="brand">
      <Logo />
    </template>
    <template slot="burger">
      <b-navbar-item
        tag="div"
        v-if="this.$route.path !== '/settings'"
      >
        <RunButton @run="run()" />
        <div class="hide-on-wide mx-2">
          <p class="mb-4 my-4">
            <b-tag
              class="mr-1"
              v-for="helper of config.helpers"
              :key="helper"
            >
              {{ helper }}
            </b-tag>
          </p>          
        </div>
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
import axios from 'axios';
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
  data() {
    return {
      config: {
        helpers: []
      },
    };
  },
  async created() {
    const config = await axios.get('/api/config');
    this.config = config.data;
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
  /* @apply shadow; */
}
</style>


