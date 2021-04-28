<template>
    <div class="work">
        <div class="container">
            <div class="container-small">
                <div class="work-content">
                    <h1 class="work-title content-pad" v-html="resolveRichText(data.work_title)">Work</h1>
                    <div class="wrapper-cols">
                        <SidebarItems v-if="isL" class="col-small content-pad" :data="data.work_sidebar_items" />
                        <div class="col-large content-pad">
                            <div class="work-intro" v-html="resolveRichText(data.work_intro)" />
                            <SidebarItems v-if="!isL" :data="data.work_sidebar_items" />
                            <Values :data="data.values" />
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
.work {
    padding: 60px 0 100px;
}
.work-content {
    position: relative;
    padding: 36px 0 0;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-2;
    }
}
.work-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 3.5rem;
    line-height: 42px;
    margin-bottom: 28px;
}
.work-intro {
    font-family: $object;
    font-weight: 400;
    font-size: 2rem;
    line-height: 30px;
    margin-bottom: 30px;
}
@media (min-width: $tablet) {
    .work-title {
        font-size: 6rem;
        line-height: 60px;
    }
}
@media (min-width: $desktop-small) {
    .work {
        padding: 100px 0;
    }
    .work-content {
        padding-top: 45px;
    }
    .work-title {
        font-size: 8rem;
        line-height: 80px;
        margin-bottom: 40px;
    }
    .work-intro {
        margin-bottom: 0;
    }
}
@media (min-width: $desktop) {
    .work {
        padding: 160px 0;
    }
    .work-content {
        padding-top: 80px;
    }
}
@media (min-width: $desktop-xxl) {
    .work-title {
        font-size: 12rem;
        line-height: 120px;
        margin-bottom: 80px;
    }
}
</style>
