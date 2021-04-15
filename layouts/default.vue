<template>
    <div>
        <Header />
        <div ref="glWrapper" class="gl-wrapper" />
        <Nuxt />
        <Grid v-show="false" />
    </div>
</template>
<script>
export default {
    mounted() {
        // Init superWindow
        this.$stereorepo.superWindow.initializeWindow(this.$store);

        // Init superScroll
        this.$stereorepo.superScroll.initializeScroll().then(firstScrollTop => {
            this.$store.commit('scroll/setFirstScrollTop', firstScrollTop);
        });
        this.$stereorepo.superScroll.on('scroll', scrollTop => {
            this.$store.commit('scroll/setScrollTop', scrollTop);
        });

        this.$webgl.init({
            dom: this.$refs.glWrapper
        });
    },
    beforeDestroy() {
        // NOTE: Avoiding memory leaks
        this.$stereorepo.superWindow.destroyWindow(this.$store);
        this.$stereorepo.superScroll.destroyScroll();
    }
};
</script>
<style lang="scss" scoped>
.gl-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
}
</style>
