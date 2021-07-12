<template>
    <div>
        <Header />
        <Nuxt />
        <CustomCursor />
        <Grid v-if="$config.isDevEnv" />
        <Svgs />
        <Overlay />
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
        window.addEventListener('mousemove', this.mouseMove, false);
    },
    beforeDestroy() {
        // NOTE: Avoiding memory leaks
        this.$stereorepo.superWindow.destroyWindow(this.$store);
        this.$stereorepo.superScroll.destroyScroll();
    },
    methods: {
        mouseMove(e) {
            if (!this.$store.state.cursor.hasMouse) this.$store.commit('cursor/setHasMouse', true);
            this.$store.commit('cursor/setMousePos', {
                x: e.clientX,
                y: e.clientY
            });
        }
    }
};
</script>
