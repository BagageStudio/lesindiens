<template>
    <div class="tags">
        <div v-for="tag in tags" :key="tag.id" class="tag">{{ tag.name }}</div>
    </div>
</template>

<script>
export default {
    props: {
        tags: {
            type: Array,
            required: true
        }
    },
    data: () => ({}),
    computed: {},
    watch: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.tags {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    &.grey {
        .tag {
            color: $black;
            background-color: $grey-6;
        }
    }
}
.tag {
    font-family: $object;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1;
    margin: 0 10px 10px 0;
    padding: 5px 8px;
    border-radius: 2px;
    color: $white;
    background-color: $grey-1;
}
</style>
