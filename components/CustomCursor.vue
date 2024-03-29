<template>
    <div ref="wrapper" class="cursor-wrapper" :class="[{ show: showCursor }, { inverted }]">
        <div ref="shadowWrapper" class="shadow-wrapper">
            <div ref="shadow" class="shadow" />
        </div>
        <div ref="roundWrapper" class="round-wrapper">
            <div ref="round" class="round" />
        </div>
        <div ref="iconWrapper" :class="{ hidden: cursorStyle !== 'icon' }" class="icon-wrapper">
            <div ref="icon" class="cursor-icon" :class="{ left: iconRotation === 'left' }">
                <Icon :name="cursorIcon" />
            </div>
        </div>
        <div ref="imageWrapper" :class="{ hidden: cursorStyle !== 'image' }" class="image-wrapper">
            <div ref="image" class="cursor-image">
                <img v-if="imageUrl" :src="imageUrl" alt="" @load="imageLoaded" />
            </div>
        </div>
    </div>
</template>
<script>
import { gsap } from 'gsap';

export default {
    data: () => ({
        roundRect: null,
        shadowRect: null,
        iconRect: null,
        imageRect: null,
        imageUrl: null
    }),
    computed: {
        cursorStyle() {
            return this.$store.state.cursor.style;
        },
        cursorIcon() {
            return this.$store.state.cursor.icon;
        },
        cursorSize() {
            return this.$store.state.cursor.size;
        },
        cursorImage() {
            return this.$store.state.cursor.image;
        },
        showCursor() {
            return this.$store.state.cursor.showCursor;
        },
        mousePos() {
            return this.$store.state.cursor.mousePos;
        },
        iconRotation() {
            return this.$store.state.cursor.iconRotation;
        },
        inverted() {
            return this.$store.state.cursor.inverted;
        }
    },
    watch: {
        $route() {
            this.$store.commit('cursor/setShowCursor', false);
        },
        cursorImage(img) {
            gsap.to(this.$refs.imageWrapper, {
                duration: 0.4,
                opacity: 0,
                onComplete: () => {
                    this.imageUrl = img;
                }
            });
        },
        cursorSize(size) {
            this.computeBCR(size);
        },
        showCursor(show) {
            gsap.to([this.$refs.round, this.$refs.icon, this.$refs.shadow, this.$refs.image], {
                duration: 0.5,
                scale: show ? 1 : 0.2,
                ease: 'power4.out'
            });
        },
        mousePos(pos) {
            const p = {
                icon: {
                    x: pos.x - this.iconRect.width / 2,
                    y: pos.y - this.iconRect.height / 2
                },
                image: {
                    x: pos.x - this.imageRect.width / 2,
                    y: pos.y - this.imageRect.height / 2
                },
                round: {
                    x: pos.x - this.roundRect.width / 2,
                    y: pos.y - this.roundRect.height / 2
                },
                shadow: {
                    x: pos.x - this.shadowRect.width / 2,
                    y: pos.y - this.shadowRect.height / 2
                }
            };
            gsap.to(this.$refs.iconWrapper, {
                duration: 0.6,
                x: p.icon.x,
                y: p.icon.y,
                force3D: true,
                ease: 'power4.out'
            });
            gsap.to(this.$refs.roundWrapper, {
                duration: 0.7,
                x: p.round.x,
                y: p.round.y,
                force3D: true,
                ease: 'power4.out'
            });

            gsap.to(this.$refs.shadowWrapper, {
                duration: 0.8,
                x: p.shadow.x,
                y: p.shadow.y,
                force3D: true,
                ease: 'power4.out'
            });

            gsap.to(this.$refs.imageWrapper, {
                duration: 0.7,
                x: p.image.x,
                y: p.image.y,
                force3D: true,
                ease: 'power4.out'
            });
        }
    },
    mounted() {
        this.computeBCR(this.cursorSize);
    },
    methods: {
        imageLoaded() {
            gsap.to(this.$refs.imageWrapper, {
                duration: 0.4,
                opacity: 1
            });
        },
        computeBCR(size) {
            this.$refs.wrapper.style.setProperty('--width', size[0]);
            this.$refs.wrapper.style.setProperty('--height', size[1]);
            this.roundRect = this.$refs.roundWrapper.getBoundingClientRect();
            this.iconRect = this.$refs.iconWrapper.getBoundingClientRect();
            this.imageRect = this.$refs.imageWrapper.getBoundingClientRect();
            this.shadowRect = this.$refs.shadowWrapper.getBoundingClientRect();
        }
    }
};
</script>
<style lang="scss" scoped>
.cursor-wrapper {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    pointer-events: none;
    user-select: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 10;
    &.show {
        opacity: 1;
    }
    &.inverted {
        .shadow {
            background: $black;
        }
        .round {
            background: $white;
        }
    }
}

.shadow-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: var(--width);
    height: var(--height);
}
.shadow {
    position: relative;
    top: 3px;
    left: 4px;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: $white;
    transform: scale(0.2) rotateZ(0);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    transform-origin: 50% 50%;
}

.round-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: var(--width);
    height: var(--height);
}
.round {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: $black;
    transform: scale(0.2) rotateZ(0);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    transform-origin: 50% 50%;
    border: 1px solid $white;
}

.icon-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: var(--width);
    height: var(--height);
    &.hidden {
        visibility: hidden;
    }
}

.cursor-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    transform: scale(0.2) rotateZ(0);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    transform-origin: 50% 50%;
    .icon {
        transform-origin: 50% 50%;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    &.left .icon {
        transform: rotate(-180deg);
    }
    .icon-arrow-long {
        width: 20px;
        height: 9px;
    }
    .icon-eye {
        width: 19px;
        height: 14px;
    }
}
.image-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: var(--width);
    height: var(--height);
    &.hidden {
        visibility: hidden;
    }
}
.cursor-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    transform-origin: 50% 50%;
    transform: scale(0.2) rotateZ(0);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    border: 1px solid $white;

    img {
        width: 110%;
        height: 110%;
        object-fit: cover;
    }
}
</style>
