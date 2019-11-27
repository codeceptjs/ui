<template>
  <div
    class="ProfileSelection"
    v-if="hasProfilesConfigured()"
  >
    <b-dropdown
      is-small
      hoverable
      aria-role="list"
    >
      <button
        class="button is-small"
        :style="selectedProfileColor"
        slot="trigger"
      >
        <span>{{ selectedProfileName }}</span>
        <i class="fas fa-caret-down" />
      </button>
      <b-dropdown-item
        aria-role="listitem"
        :key="profile"
        v-for="profile in profileNames"
        @click="selectProfileName(profile)"
      >
        {{ profile }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfileSelection',
  data() {
    return {
      profileConfig: {},
      profileNames: [],
      defaultProfile: undefined,
    };
  },
  created() {
    this.loadProfiles();
  },
  computed: {
    selectedProfileName() {
      return this.$store.getters['profiles/selectedProfileName'];
    },
    selectedProfileColor() {
      const selectedProfileName = this.selectedProfileName;
      if (!this.profileConfig[selectedProfileName]) {
        return 'black';
      }
      return this.profileConfig[selectedProfileName].color || 'black';
    }
  },
  methods: {
    async loadProfiles() {
      const response = await axios.get('/api/profiles');
      this.profileConfig = response.data;
      this.profileNames = Object.keys(this.profileConfig).filter(profile => profile !== 'default');
      this.defaultProfile = this.profileConfig.default;
    },

    selectProfileName(profileName) {
      this.$store.commit('profiles/selectProfileName', profileName);
    },

    hasProfilesConfigured() {
      return this.profileNames.length > 0;
    }
  }
};
</script>
