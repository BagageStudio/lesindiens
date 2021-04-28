<template>
    <div class="love">
        <div class="container">
            <div class="container-small">
                <div class="love-content">
                    <div class="wrapper-cols">
                        <div class="col-small content-pad">
                            <h4 class="love-title" v-html="resolveRichText(data.love_title)" />
                        </div>
                        <div class="col-large content-pad">
                            <div class="love-intro" v-html="resolveRichText(data.love_intro)" />
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
    computed: {
        isL() {
            if (!this.$store.state.superWindow) return true;
            return this.$store.state.superWindow.width >= this.$breakpoints.list.l;
        }
    },
    watch: {},
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        }
    }
};
</script>

<style lang="scss" scoped>
.love {
    padding: 60px 0;
    color: $black;
    background-color: $white;
}
.love-content {
    position: relative;
    padding: 36px 0 0;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
    }
}
.love-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin-bottom: 28px;
    :v-deep br {
        display: none;
    }
}
.love-intro {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 30px;
    margin-bottom: 30px;
}
@media (min-width: $desktop-small) {
    .love {
        padding: 100px 0;
    }
    .love-content {
        padding-top: 45px;
    }
    .love-title {
        font-size: 3.5rem;
        line-height: 42px;
        margin-bottom: 30px;
        :v-deep br {
            display: block;
        }
    }
}
@media (min-width: $desktop) {
    .love {
        padding: 160px 0;
    }
    .love-content {
        padding-top: 80px;
    }
}
</style>
