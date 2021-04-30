<template>
    <div class="sidebar-items">
        <div
            v-for="item in data"
            :key="item._uid"
            :class="{ 'margin-between': item.margin_between }"
            class="sidebar-item"
        >
            <span class="sidebar-title">{{ item.title }}</span>
            <div class="sidebar-content" v-html="resolveRichText(item.text)" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Array, required: true }
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
.sidebar-item {
    &.margin-between {
        .sidebar-title {
            margin-bottom: 35px;
        }
    }
}
.sidebar-title {
    display: block;
    font-family: $object;
    font-size: 1.6rem;
    line-height: 20px;
    color: $grey-3;
    margin-bottom: 9px;
}
.sidebar-item {
    margin-top: 35px;
    &:first-child {
        margin-top: 0;
    }
}
</style>
