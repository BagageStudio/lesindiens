<template>
    <div class="module-numbered-list">
        <div class="container">
            <div class="container-small">
                <div class="wrapper-numered-list">
                    <div class="wrapper-cols">
                        <div class="col-small content-pad">
                            <span class="numbered-list-title">{{ data.title }}</span>
                        </div>
                        <div class="col-large content-pad">
                            <div v-html="resolveRichText(data.content)" />
                        </div>
                    </div>
                </div>
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
    computed: {},
    watch: {},
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper-numered-list {
    position: relative;
    margin: 40px 0 0;
    padding: 30px 0 50px;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
    }
}
.numbered-list-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
}

@media (min-width: $desktop-small) {
    .wrapper-numered-list {
        margin-top: 75px;
        padding: 75px 0 105px;
        ::v-deep ol {
            counter-reset: ol-counter;
            > li {
                padding-left: 0;
                &::before {
                    left: calc(-30px - #{2 * $gutter});
                    width: 30px;
                    text-align: right;
                }
            }
        }
    }
}
@media (min-width: $desktop) {
    .wrapper-numered-list {
        padding: 115px 0 160px;
    }
    .numbered-list-title {
        font-size: 3.5rem;
        line-height: 42px;
    }
}
</style>
