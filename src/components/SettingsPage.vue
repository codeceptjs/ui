<template>
  <section class="SettingsPage">
    <div class="container">
      <h1 class="title">Settings</h1>

      To be implemented...
      <button class="button is-primary m-1" @click="goToBack()">
       Back
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SettingsPage',
  methods: {
    goToBack() {
      this.$router.go(-1);
    },
  },
}
</script>
