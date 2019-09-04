<template>
    <b-dropdown position="is-bottom-left" aria-role="menu">
        <a
            class="navbar-item"
            slot="trigger"
            role="button">
            <i class="fas fa-cog"></i>
        </a>

        <b-dropdown-item
            aria-role="menu-item"
            :focusable="false"
            custom
            paddingless>
            <form action="">
                <div class="modal-card" style="width:300px;">
                    <section class="modal-card-body">
                        <h3 class="title is-size-6">Quick Settings</h3>
                        <b-switch v-model="settings.headless">
                            Run Headless
                        </b-switch>
                        <p></p>
                        <b-switch v-model="settings.showDevtools">
                            Show Devtools
                        </b-switch>
                    </section>
                    <footer class="modal-card-foot">
                        <a class="is-small" @click="gotoSettingsPage()">Configure all settings ...</a>
                    </footer>
                </div>
            </form>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
export default {
    name: 'SettingsMenu',
    data() {
        return {
            settings: {}
        }
    },
    async created() {
        this.settings = await this.loadSettings();
    },
    updated() {
        this.storeSettings(this.settings);
    },
    methods: {
        async loadSettings() {
            return this.$store.dispatch('settings/loadSettings');
        },
        async storeSettings(settings) {
            return this.$store.dispatch('settings/storeSettings', settings);
        },
        gotoSettingsPage() {
            this.$router.push('settings');
        }
    }
}
</script>