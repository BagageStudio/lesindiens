<template>
    <div class="stickers content-pad">
        <div
            v-for="(sticker, index) in data"
            ref="sticker"
            :key="sticker.id"
            class="sticker"
            @mousemove="mouseMove($event, index)"
            @mouseenter="mouseEnter(index)"
            @mouseleave="mouseLeave(index)"
        >
            <div ref="shadow" class="shadow" />
            <div ref="frame" class="frame" />
            <div ref="stickerContent" class="sticker-content">
                <FastImage :image="sticker" />
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import { round } from '~/assets/js/utils';

export default {
    props: {
        data: { type: Array, required: true }
    },
    data: () => ({
        stickers: [],
        shadows: [],
        frames: [],
        stickersContent: [],
        stickersRect: [],
        percentageX: 0,
        percentageY: 0,
        XShadow: 0,
        YShadow: 0,
        rotXFrame: 0,
        rotYFrame: 0,
        rotXIllus: 0,
        rotYIllus: 0
    }),
    computed: {
        scrollTop() {
            return this.$store.state.scroll.scrollTop;
        }
    },
    watch: {
        scrollTop() {
            this.computeRect();
        }
    },
    mounted() {
        this.init();
        this.computeRect();
    },
    methods: {
        init() {
            this.stickers = this.$refs.sticker;
            this.shadows = this.$refs.shadow;
            this.frames = this.$refs.frame;
            this.stickersContent = this.$refs.stickerContent;
        },
        mouseMove(e, index) {
            this.tilt(e.pageX, e.pageY, index);
        },
        mouseEnter(index) {
            gsap.to([this.stickersContent[index], this.frames[index], this.shadows[index]], {
                duration: 0.2,
                scale: 1.05
            });
        },
        mouseLeave(index) {
            gsap.to([this.stickersContent[index], this.frames[index], this.shadows[index]], {
                duration: 0.5,
                rotationX: 0,
                rotationY: 0,
                scale: 1
            });
            gsap.to(this.shadows[index], {
                duration: 0.5,
                x: 4,
                y: 3,
                rotationX: 0,
                rotationY: 0,
                scale: 1
            });
        },
        tilt(cx, cy, index) {
            this.percentageX = round(
                ((cx - this.stickersRect[index].left - this.stickersRect[index].width / 2) /
                    this.stickersRect[index].width) *
                    2
            );
            this.percentageY = round(
                ((cy - this.stickersRect[index].top - this.scrollTop - this.stickersRect[index].height / 2) /
                    this.stickersRect[index].height) *
                    2
            );
            this.XShadow = this.percentageX * 4;
            this.YShadow = this.percentageY * 3;
            this.rotXFrame = -this.percentageY * 15;
            this.rotYFrame = this.percentageX * 15;
            this.rotXIllus = -this.percentageY * 20;
            this.rotYIllus = this.percentageX * 20;
            gsap.to(this.shadows[index], {
                duration: 0.2,
                x: this.XShadow,
                y: this.YShadow,
                rotationX: this.rotXFrame,
                rotationY: this.rotYFrame
            });
            gsap.to(this.frames[index], {
                duration: 0.2,
                rotationX: this.rotXFrame,
                rotationY: this.rotYFrame
            });
            gsap.to(this.stickersContent[index], {
                duration: 0.2,
                rotationX: this.rotXIllus,
                rotationY: this.rotYIllus
            });
        },
        computeRect() {
            for (let index = 0; index < this.stickers.length; index++) {
                this.stickersRect[index] = this.stickers[index].getBoundingClientRect();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.sticker {
    position: relative;
    width: 189px;
    height: 228px;
    perspective: 500px;
}
.shadow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $white;
    border-radius: 10px;
    transform: translate3d(4px, 3px, 0);
}
.frame {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $black;
    border: 1px solid $white;
    border-radius: 10px;
    transform-origin: 50% 50% -50px;
}
.sticker-content {
    position: relative;
    transform-origin: 50% 50% -20px;
}
.class {
    transform-origin: 50% 50%;
}
</style>
