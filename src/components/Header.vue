<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item @click.stop="gotoScenarios()">
                <img src="../assets/logo.png" alt="codeceptui logo">
                &nbsp;CodeceptUI
            </b-navbar-item>
        </template>

        <template slot="burger">
            <b-navbar-item tag="div">
                <button class="button is-primary is-outlined is-small" 
                    v-on:click="run()"
                    :disabled="!!loading"
                >
                    <i class="fas fa-play"></i>
                    &nbsp;
                    Run
                </button>&nbsp;
                <i v-if="loading" class="fas fa-circle-notch fa-spin fixed-width"></i>
            </b-navbar-item>
        </template>
        <template slot="end">
            <b-navbar-item tag="div">
                <SettingsMenu />
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
import SettingsMenu from './SettingsMenu';

export default {
    name: 'Header',
    props: ['loading'],
    components: { SettingsMenu },
    methods: {
        run() {
            this.$emit('run');
        },

        gotoScenarios() {
            this.$router.push('/');
        }
    }
}
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


