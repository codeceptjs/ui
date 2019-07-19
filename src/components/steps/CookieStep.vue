<template>
    <div class="CookieStep has-text-grey">
        <i class="Step-icon fas fa-cookie"></i> 
        {{step.humanized}} {{formatCookie(step.args[0])}}
    </div>
</template>

<script>
export default {
    name: 'CookieStep',
    props: ['step'],
    methods: {
        formatCookie(cookieData) {
            return `${cookieData.name}=${cookieData.value}`;
        }
    }
}
</script>

<style>
.CookieStep {
  font-size: 0.8em;
  margin-left: 1em;
  padding: 2px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
