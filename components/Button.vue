<template>
    <component
        :is="link !== '#' ? 'a' : 'span'"
        ref="button"
        :href="link"
        :class="{ 'large-btn': large }"
        @mousemove="mouseMove"
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
    >
        <span class="shadow" />
        <span class="frame" />
        <span class="button-content">
            <span class="text">
                <slot :computeRect="computeRect" />
            </span>
            <Icon v-if="icon" name="arrow" />
        </span>
    </component>
</template>

<script>
import { gsap } from 'gsap';
import { round } from '~/assets/js/utils';

export default {
    props: {
        icon: {
            required: false,
            default: false,
            type: Boolean
        },
        link: {
            type: String,
            required: false,
            default: '#'
        },
        large: {
            required: false,
            default: false,
            type: Boolean
        }
    },
    data: () => ({
        animScale: null,
        button: null,
        sticker: null,
        stickerRect: [],
        percentageX: 0,
        percentageY: 0,
        XShadow: 0,
        YShadow: 0,
        rotXFrame: 0,
        rotYFrame: 0,
        rotXIllus: 0,
        rotYIllus: 0,
        appearTl: null
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
            this.computeRect();
        }
    },
    beforeDestroy() {
        if (this.animScale) this.animScale.kill();
    },
    mounted() {
        this.init();
        this.$nextTick(() => {
            this.computeRect();
        });
    },
    methods: {
        init() {
            this.button = this.$refs.button;
            this.sticker = this.getStickerFromButton(this.button);
        },
        getStickerFromButton(button) {
            const sticker = button;
            const shadow = sticker.getElementsByClassName('shadow')[0];
            const frame = sticker.getElementsByClassName('frame')[0];
            const stickerContent = sticker.getElementsByClassName('button-content')[0];
            const rect = this.stickerRect;
            return { sticker, shadow, frame, stickerContent, rect };
        },
        mouseMove(e) {
            this.tilt(e.pageX, e.pageY);
        },
        mouseEnter() {
            this.sticker = this.getStickerFromButton(this.button);
            if (this.animScale) this.animScale.kill();
            this.animScale = gsap.to([this.sticker.stickerContent, this.sticker.frame, this.sticker.shadow], {
                duration: 0.2,
                scale: 1.05
            });
        },
        mouseLeave() {
            if (this.animScale) this.animScale.kill();
            this.animScale = gsap
                .timeline()
                .to(
                    [this.sticker.stickerContent, this.sticker.frame, this.sticker.shadow],
                    {
                        duration: 0.5,
                        rotationX: 0,
                        rotationY: 0,
                        scale: 1
                    },
                    'start'
                )
                .to(
                    this.sticker.shadow,
                    {
                        duration: 0.5,
                        x: 4,
                        y: 3,
                        rotationX: 0,
                        rotationY: 0,
                        scale: 1
                    },
                    'start'
                );
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
            this.rotXFrame = -this.percentageY * 8;
            this.rotYFrame = this.percentageX * 8;
            this.rotXIllus = -this.percentageY * 13;
            this.rotYIllus = this.percentageX * 13;
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
            this.stickerRect = this.button.getBoundingClientRect();
        },
        createAppearTimeline() {
            const tl = gsap.timeline({
                paused: true,
                onComplete: () => {
                    this.computeRect();
                }
            });
            tl.addLabel('start');

            const startX = 0;
            const startY = -1;
            const offsetX = 0;
            const offsetY = -8;

            gsap.set(this.sticker.sticker, {
                opacity: 0
            });

            tl.to(
                this.sticker.sticker,
                {
                    duration: 0.5,
                    opacity: 1
                },
                'start'
            );
            tl.from(
                this.sticker.sticker,
                {
                    duration: 1.5,
                    y: offsetY,
                    x: offsetX,
                    ease: 'elastic.out(1.9, 0.25)'
                },
                'start'
            );
            tl.from(
                this.sticker.shadow,
                {
                    duration: 1.5,
                    x: 4 * startX,
                    y: 3 * startY,
                    rotationX: -15 * startY,
                    rotationY: 15 * startX,
                    ease: 'elastic.out(1.9, 0.25)'
                },
                'start'
            );

            tl.from(
                this.sticker.frame,
                {
                    duration: 1.5,
                    rotationX: -15 * startY,
                    rotationY: 15 * startX,
                    ease: 'elastic.out(1.9, 0.25)'
                },
                'start'
            );
            tl.from(
                this.sticker.stickerContent,
                {
                    duration: 1.5,
                    rotationX: -20 * startY,
                    rotationY: 20 * startX,
                    ease: 'elastic.out(1.9, 0.25)'
                },
                'start'
            );
            return tl;
        },
        hide() {
            this.appearTl = this.createAppearTimeline();
        },
        appear() {
            this.appearTl.play();
        }
    }
};
</script>

<style lang="scss" scoped>
.icon {
    position: relative;
    z-index: 1;
    height: 9px;
    width: 14px;
    fill: currentColor;
}

.primary {
    position: relative;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-size: 1.5rem;
    padding: 7px 17px;
    z-index: 1;
    &.align-top {
        .button-content {
            align-items: baseline;
        }
    }
    &.color-secondary {
        .shadow {
            background: var(--secondary);
        }
        .frame {
            border-color: var(--secondary);
        }
    }
    &.large-btn {
        font-size: 1.6rem;
        .icon {
            margin-left: 80px;
        }
    }
    .icon {
        margin-left: 20px;
    }
    &.huge {
        padding: 20px;
    }
}
.shadow {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: var(--quaternary);
    border-radius: 10px;
    transform: translate3d(4px, 3px, 0);
}
.frame {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: var(--primary);
    border: 1px solid var(--quaternary);
    border-radius: 10px;
    transform-origin: 50% 50% -50px;
    transform: translate3d(0, 0, 50px);
}
.button-content {
    position: relative;
    display: inline-flex;
    align-items: center;
    transform: translate3d(0, 0, 100px);
}
.text {
    position: relative;
    transform-origin: 50% 50% -20px;
}
.txt-pre {
    display: block;
}
</style>
