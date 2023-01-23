<template>
    <div>
        <div ref="sizeElement" class="size-element" @mouseenter="showCursor" @mouseleave="hideCursor">
            <div class="container big-title-container">
                <p class="big-title">{{ data.title }}</p>
            </div>
        </div>
        <div ref="webgl" class="fun-gl" />
    </div>
</template>

<script>
import { FunGL } from '~/assets/js/webgl/Fun/index';

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.funGL = FunGL;
        const images = this.data.photos.map(p => ({
            id: p.id,
            image: p.filename.replace('a.storyblok', 's3.amazonaws.com/a.storyblok')
        }));
        this.funGL.init({ dom: this.$refs.webgl, sizeElement: this.$refs.sizeElement, images });
    },
    methods: {
        showCursor() {
            this.$store.commit('cursor/setIcon', 'eye');
            this.$store.commit('cursor/setShowCursor', true);
            this.cursorIsShown = true;
        },
        hideCursor() {
            this.$store.commit('cursor/setShowCursor', false);
            this.cursorIsShown = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.fun-gl {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
}
.big-title {
    display: none;
}
.size-element {
    width: 100%;
    height: 1000px;
    //to go just at the line of the footer
    margin-bottom: -199px;
    cursor: none;
}
@media (min-width: $desktop-small) {
    .size-element {
        padding-top: 115px;
    }
    .big-title {
        display: block;
        font-family: $telegraf;
        font-weight: 100;
        text-align: center;
        font-size: 12rem;
        line-height: 80px;
        user-select: none;
        pointer-events: none;
    }
}
@media (min-width: $desktop) {
    .size-element {
        height: 1060px;
        //to go just at the line of the footer
        margin-bottom: -258px;
    }
}
</style>
