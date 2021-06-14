<template>
    <div class="module-video">
        <Video :video="data.video[0]" full-width />
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

<style lang="scss" scoped></style>
