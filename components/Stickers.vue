<template>
    <div class="stickers content-pad">
        <div class="stickers-line">
            <div
                v-for="sticker in lineOne"
                :id="sticker.id"
                ref="sticker"
                :key="sticker.id"
                class="sticker"
                @mousemove="mouseMove"
                @mouseenter="mouseEnter(sticker.id.toString())"
                @mouseleave="mouseLeave"
            >
                <div class="shadow" />
                <div class="frame" />
                <div class="sticker-content">
                    <FastImage :image="sticker" />
                </div>
            </div>
        </div>
        <div class="stickers-line">
            <div
                v-for="sticker in lineTwo"
                :id="sticker.id"
                ref="sticker"
                :key="sticker.id"
                class="sticker"
                @mousemove="mouseMove"
                @mouseenter="mouseEnter(sticker.id.toString())"
                @mouseleave="mouseLeave"
            >
                <div class="shadow" />
                <div class="frame" />
                <div class="sticker-content">
                    <FastImage :image="sticker" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import { round } from '~/assets/js/utils';

export default {
    props: {
        lineOne: { type: Array, required: true },
        lineTwo: { type: Array, required: true }
    },
    data: () => ({
        sticker: null,
        stickers: [],
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
        },
        ww() {
            return this.$store.state.superWindow ? this.$store.state.superWindow.width : 320;
        }
    },
    watch: {
        scrollTop() {
            this.computeRect();
        },
        ww() {
            if (!this.$store.state.superWindow) return true;
            if (this.$store.state.superWindow.width >= this.$breakpoints.list.l) {
                this.computeRect();
            }
        }
    },
    mounted() {
        this.init();
        this.computeRect();
    },
    methods: {
        init() {
            this.stickers = this.$refs.sticker;
        },
        getStickerFromID(id) {
            const sticker = this.stickers.find(s => {
                return s.id === id;
            });
            const shadow = sticker.getElementsByClassName('shadow')[0];
            const frame = sticker.getElementsByClassName('frame')[0];
            const stickerContent = sticker.getElementsByClassName('sticker-content')[0];
            const rect = this.stickersRect[id];
            return { sticker, shadow, frame, stickerContent, rect };
        },
        mouseMove(e) {
            this.tilt(e.pageX, e.pageY);
        },
        mouseEnter(id) {
            this.sticker = this.getStickerFromID(id);
            gsap.to([this.sticker.stickerContent, this.sticker.frame, this.sticker.shadow], {
                duration: 0.2,
                scale: 1.05
            });
        },
        mouseLeave() {
            gsap.to([this.sticker.stickerContent, this.sticker.frame, this.sticker.shadow], {
                duration: 0.5,
                rotationX: 0,
                rotationY: 0,
                scale: 1
            });
            gsap.to(this.sticker.shadow, {
                duration: 0.5,
                x: 4,
                y: 3,
                rotationX: 0,
                rotationY: 0,
                scale: 1
            });
            this.sticker = null;
        },
        tilt(cx, cy) {
            this.percentageX = round(
                ((cx - this.sticker.rect.left - this.sticker.rect.width / 2) / this.sticker.rect.width) * 2
            );
            this.percentageY = round(
                ((cy - this.sticker.rect.top - this.scrollTop - this.sticker.rect.height / 2) /
                    this.sticker.rect.height) *
                    2
            );
            this.XShadow = this.percentageX * 4;
            this.YShadow = this.percentageY * 3;
            this.rotXFrame = -this.percentageY * 15;
            this.rotYFrame = this.percentageX * 15;
            this.rotXIllus = -this.percentageY * 20;
            this.rotYIllus = this.percentageX * 20;
            gsap.to(this.sticker.shadow, {
                duration: 0.2,
                x: this.XShadow,
                y: this.YShadow,
                rotationX: this.rotXFrame,
                rotationY: this.rotYFrame
            });
            gsap.to(this.sticker.frame, {
                duration: 0.2,
                rotationX: this.rotXFrame,
                rotationY: this.rotYFrame
            });
            gsap.to(this.sticker.stickerContent, {
                duration: 0.2,
                rotationX: this.rotXIllus,
                rotationY: this.rotYIllus
            });
        },
        computeRect() {
            const stickersRect = {};
            for (let index = 0; index < this.stickers.length; index++) {
                const id = this.stickers[index].id;
                stickersRect[id] = this.stickers[index].getBoundingClientRect();
            }
            this.stickersRect = stickersRect;
        }
    }
};
</script>

<style lang="scss" scoped>
.sticker {
    position: relative;
    perspective: 500px;
    margin: 15px;
    &:hover {
        .shadow {
            background: $white;
            transition-duration: 0.2s;
        }
        .frame {
            border-color: $white;
            transition-duration: 0.2s;
        }
    }
}
.stickers-line {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    &:nth-child(1) {
        align-items: flex-end;
        .sticker {
            &:nth-child(1) {
                right: 31px;
                width: 269px;
                height: 82px;
            }
            &:nth-child(2) {
                top: 36px;
                left: 31px;
                width: 151px;
                height: 148px;
            }
        }
    }
    &:nth-child(2) {
        .sticker {
            &:nth-child(1) {
                width: 269px;
                height: 82px;
            }
            &:nth-child(2) {
                width: 151px;
                height: 148px;
            }
            &:nth-child(3) {
                top: 36px;
                width: 275px;
                height: 115px;
            }
        }
    }
}
.shadow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $grey-1;
    border-radius: 10px;
    transform: translate3d(4px, 3px, 0);
    transition: background-color 0.5s ease-out;
}
.frame {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $black;
    border: 1px solid $grey-1;
    border-radius: 10px;
    transform-origin: 50% 50% -50px;
    transition: border-color 0.5s ease-out;
}
.sticker-content {
    position: relative;
    transform-origin: 50% 50% -20px;
}
.class {
    transform-origin: 50% 50%;
}

@media (min-width: $desktop-large) {
    .sticker {
        margin: 20px;
    }
    .stickers-line {
        &:nth-child(1) {
            .sticker {
                &:nth-child(1) {
                    right: 36px;
                    width: 336px;
                    height: 102px;
                }
                &:nth-child(2) {
                    top: 41px;
                    left: 36px;
                    width: 189px;
                    height: 185px;
                }
            }
        }
        &:nth-child(2) {
            .sticker {
                &:nth-child(1) {
                    width: 336px;
                    height: 102px;
                }
                &:nth-child(2) {
                    width: 189px;
                    height: 185px;
                }
                &:nth-child(3) {
                    top: 41px;
                    width: 344px;
                    height: 144px;
                }
            }
        }
    }
}
</style>
