<template>
    <div class="module-text" :class="{ 'is-white': data.white_bg }">
        <div class="container">
            <div class="container-small">
                <div class="wrapper-text">
                    <div class="module-text-title content-pad">
                        <h3 class="title">{{ data.title }}</h3>
                    </div>
                    <div class="module-text-content content-pad" v-html="richtext" />
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
        richtext() {
            return this.$storyapi.richTextResolver.render(this.data.text);
        }
    },
    watch: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.module-text {
    padding: 60px 0;
    &.is-white {
        color: $black;
        background: $white;
        .wrapper-text {
            &::before {
                border-color: $grey-5;
            }
        }
    }
}
.wrapper-text {
    position: relative;
    padding: 35px 0 0;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $white;
    }
}
.module-text-title {
    margin-bottom: 28px;
}
.title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
}

@media (min-width: $desktop-small) {
    .module-text {
        padding: 100px 0;
    }
    .wrapper-text {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-top: 45px;
    }
    .module-text-title {
        width: percentage(2/8);
    }
    .module-text-content {
        width: percentage(5/8);
    }
}
@media (min-width: $desktop) {
    .module-text {
        padding: 160px 0;
    }
    .wrapper-text {
        padding-top: 60px;
    }
    .module-text-title {
        width: percentage(3/10);
    }
    .module-text-content {
        width: percentage(6/10);
    }
    .title {
        font-size: 3rem;
        line-height: 36px;
    }
}
@media (min-width: $desktop-large) {
    .title {
        font-size: 3.5rem;
        line-height: 42px;
    }
}
</style>
