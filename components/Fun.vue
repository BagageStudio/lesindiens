<template>
    <div class="fun">
        <div class="container">
            <div class="container-small">
                <div class="wrapper-cols">
                    <div class="col-large content-pad">
                        <h4 v-if="!isL" class="fun-title">{{ data.fun_title }}</h4>
                        <div class="fun-intro" v-html="resolveRichText(data.fun_intro)" />
                    </div>
                    <div class="col-small content-pad">
                        <SidebarItems class="fun-sidebar" :data="data.fun_sidebar_items" />
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
.fun {
    padding: 60px 0;
}
.fun-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin-bottom: 28px;
}
.fun-intro {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 30px;
    margin-bottom: 30px;
}
.fun-sidebar {
    margin-top: 50px;
}
@media (min-width: $desktop-small) {
    .fun {
        padding: 100px 0;
    }
    .fun-sidebar {
        margin-top: 0;
    }
}
@media (min-width: $desktop) {
    .fun {
        padding: 160px 0;
    }
}
</style>
