<template>
    <div class="work">
        <div class="container">
            <div class="container-small">
                <h1 v-html="resolveRichText(data.work_title)">Work</h1>
                <div class="work-intro" v-html="resolveRichText(data.work_intro)" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true }
    },
    data: () => ({}),
    watch: {},
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        }
    }
};
</script>

<style lang="scss" scoped>
.work {
    padding: 60px 0 100px;
}
</style>
