<template>
    <span class="CapabilityFolder has-text-grey">
        <i class="far fa-folder-open"></i>
        &nbsp;
        <span v-for="p in splitPath(folder)">
                <span class="has-text-grey-lighter">/</span> {{p}}
        </span>
    </span>
</template>

<script>
export default {
    name: 'CapabilityFolder',
    props: ['folder'],
    methods: {
        splitPath(p) {
            return p.split('/').slice(1);
        }
    }
}
</script>
<style>
.CapabilityFolder {
}

.CapabilityFolder span:last-child {
    font-weight: bold;
}
</style>