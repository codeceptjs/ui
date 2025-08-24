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
        class="navbar-burger-content"
      >
        <RunButton @run="run()" />
        <div class="hide-on-wide mx-2">
          <p class="mb-4 my-4">
            <b-tag
              class="mr-1"
              v-for="helper of config.helpers"
              :key="helper"
              type="is-info is-light"
              size="is-small"
            >
              {{ helper }}
            </b-tag>
          </p>
          <!-- Show current test name on mobile -->
          <div
            v-if="$route.path.startsWith('/run/')"
            class="current-test-info"
          >
            <p class="text-sm text-gray-600">
              <i class="fas fa-play-circle mr-1" />
              Running Test
            </p>
          </div>
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

.navbar-burger-content {
  @media (max-width: 1024px) {
    width: 100%;
  }
}

.current-test-info {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Better mobile navbar styling */
@media (max-width: 1024px) {
  .navbar-brand {
    flex-grow: 1;
  }
  
  .navbar-burger {
    width: auto;
    height: auto;
  }
}
</style>


