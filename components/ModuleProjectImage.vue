<template>
    <div class="module-image" :class="{ 'is-white': data.white_bg }">
        <FastImage :image="data.image" full-width />
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true }
    },
    data: () => ({}),
    computed: {},
    watch: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.module-image.is-white {
    background: $white;
}
.fast-image {
    display: block;
}
</style>
