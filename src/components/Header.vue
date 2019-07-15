<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io">
                <b>
                    <span style="color: white;background-color: black;padding: 2px 5px;border-radius: 5px;">CODE</span>PRESS
                </b>
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <a v-if="loading" class="navbar-item">
                    <i class="fas fa-circle-notch fa-spin"></i>
                </a>

                <div class="navbar-item">
                    <a class="button is-primary is-outlined is-small" v-on:click="run()">
                        <i class="fas fa-play"></i>
                        &nbsp;
                        Run
                    </a>
                </div>


            </div>

            <!--
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
                    </a>
                    </div>
                </div>
            </div>
            -->
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Header',
    props: ['loading'],
    methods: {
        run() {
            this.$emit('run');
        }
    }
}
</script>

