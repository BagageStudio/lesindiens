<template>
    <div class="values">
        <div v-for="value in data" :key="value._uid" class="value">
            <FastImage class="value-icon" :image="value.icon" />
            <div class="value-title">{{ value.title }}</div>
            <p class="value-content">{{ value.description }}</p>
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
.values {
    margin-top: 40px;
}
.value {
    margin-bottom: 80px;
    padding-top: 33px;
    border-top: 1px solid $white;
    &:last-child {
        margin-bottom: 0;
    }
}
.value-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin: 30px 0 20px;
    margin-bottom: 20px;
}
.value-content {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 30px;
}

@media (min-width: $phone) {
    .values {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + #{2 * $gutter});
        margin-left: -#{$gutter};
    }
    .value {
        width: calc(50% - #{2 * $gutter});
        margin: 0 #{$gutter} 80px;
        &:nth-last-child(-n + 2) {
            margin-bottom: 0;
        }
    }
}
</style>
