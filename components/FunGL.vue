<template>
    <div class="fun-gl-wrapper">
        <div ref="sizeElement" class="size-element" @mouseenter="showCursor" @mouseleave="hideCursor">
            <div class="container big-title-container">
                <p class="big-title">{{ data.title }}</p>
            </div>
        </div>
        <div ref="webgl" class="fun-gl" />
        <div v-if="data.placeholderPhotos.length" class="container wrapper-placeholder-photos">
            <div class="placeholder-photos">
                <div
                    v-for="(photo, index) in data.placeholderPhotos"
                    :key="index"
                    class="placeholder-photo content-pad"
                >
                    <FastImage :image="photo" />
                </div>
            </div>
        </div>
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
.wrapper-placeholder-photos {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -2;
    overflow: hidden;
}

.placeholder-photos {
    position: relative;
    width: 100%;
    height: 100%;
}
.placeholder-photo {
    width: 37.5%;
    position: absolute;
    &:nth-child(1) {
        bottom: 650px;
        left: 37.5%;
    }
    &:nth-child(2) {
        bottom: 420px;
        left: 75%;
        z-index: 1;
    }

    &:nth-child(3) {
        bottom: 200px;
        left: 50%;
    }

    &:nth-child(4) {
        bottom: 350px;
        left: 0;
    }
}
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
    .placeholder-photo {
        width: 25%;
        &:nth-child(1) {
            left: 41.6666%;
        }
        &:nth-child(2) {
            left: 66.666%;
        }

        &:nth-child(3) {
            bottom: 150px;
        }

        &:nth-child(4) {
            left: 8.333%;
        }
    }
}
</style>
