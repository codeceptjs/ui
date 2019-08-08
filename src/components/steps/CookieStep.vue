<template>
    <div class="CookieStep has-text-grey-light columns is-gapless">
        <div class="colum">
            <i class="Step-icon fas fa-cookie"></i> {{step.humanized}}
        </div>
        <div class="colum">
            {{formatCookie(step.args[0])}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'CookieStep',
    props: ['step'],
    methods: {
        formatCookie(cookieData) {
            if (!cookieData) return '';
            return `${cookieData.name}=${cookieData.value}`;
        }
    }
}
</script>

<style>
.CookieStep {
  padding-left: .5em;
}

</style>
