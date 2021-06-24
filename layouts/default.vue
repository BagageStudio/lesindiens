<template>
    <div>
        <Header />
        <Nuxt />
        <CustomCursor />
        <Grid v-if="$config.isDevEnv" />
        <Svgs />
    </div>
</template>
<script>
export default {
    fetchOnServer: false,
    async fetch() {
        const res = await this.$axios.get('/.netlify/functions/getPlaylist');
        this.$store.commit('playlist/setTracks', res.data.playlist.items);
    },
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
