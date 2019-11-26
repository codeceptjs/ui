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
                <RunButton @run="run()"></RunButton>
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
import RunButton from './RunButton';

export default {
    name: 'Header',
    props: ['loading'],
    components: { SettingsMenu, RunButton },
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


