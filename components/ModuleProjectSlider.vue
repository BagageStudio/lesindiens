<template>
    <div class="module-slider">
        <div
            class="container"
            @mousedown="lock"
            @touchstart="lock"
            @mouseup="move"
            @touchend="move"
            @mousemove="mouseMove"
            @touchmove="moving"
            @mouseenter="showCursor"
            @mouseleave="hideCursor"
            @click="changeSlide"
        >
            <div ref="slider" class="wrapper-slider">
                <ul class="slider">
                    <li v-for="slide in data.images" :key="slide.id">
                        <FastImage :image="slide" />
                    </li>
                </ul>
                <ul ref="sliderCopy" class="slider copy" :class="{ 'is-after': copyAfter }">
                    <li v-for="slide in data.images" :key="slide.id">
                        <FastImage :image="slide" />
                    </li>
                </ul>
            </div>
            <div class="wrapper-buttons content-pad">
                <button class="btn-prev arrow-button" type="button" aria-label="Projet précédent" @click="prevSlides">
                    <Icon name="arrow-long-left" />
                </button>
                <button class="btn-next arrow-button" aria-label="Projet suivant" type="button" @click="nextSlides">
                    <Icon name="arrow-long" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
    props: {
        data: { type: Object, required: true }
    },
    data: () => ({
        currentSlide: 1,
        nbSlides: 0,
        widthPercentage: 125,
        sign: '-',
        x0: null,
        y0: null,
        willSwipe: true,
        copyAfter: false,
        cursorDirection: null,
        over: false
    }),
    computed: {
        ww() {
            if (!this.$store.state.superWindow) return false;
            return this.$store.state.superWindow.width;
        },
        resizing() {
            if (!this.$store.state.superWindow) return false;
            return this.$store.state.superWindow.resizing;
        },
        isMobile() {
            return this.ww <= this.$breakpoints.list.m;
        },
        cursorIcon() {
            return this.$store.state.cursor.icon;
        },
        hasMouse() {
            return this.$store.state.cursor.hasMouse;
        },
        mousePos() {
            return this.$store.state.cursor.mousePos;
        }
    },
    watch: {
        resizing(r) {
            if (r) return;
            this.initSlides();
            this.rect = this.$refs.slider.getBoundingClientRect();
        }
    },
    mounted() {
        this.rect = this.$refs.slider.getBoundingClientRect();
        this.nbSlides = this.data.images.length;
        this.$nextTick(() => {
            this.initSlides();
        });
    },
    methods: {
        initSlides() {
            this.currentSlide = 1;
            gsap.set(this.$refs.slider, { x: 0 });
            this.copyAfter = false;
            gsap.set(this.$refs.sliderCopy, { x: '-100%' });
            if (this.ww >= this.$breakpoints.list.xl) {
                this.widthPercentage = 112.5;
            } else if (this.ww >= this.$breakpoints.list.m) {
                this.widthPercentage = 116.66;
            } else {
                this.widthPercentage = 125;
            }
        },
        moveSlides(toNext) {
            if (!gsap.isTweening(this.$refs.slider)) {
                if (toNext) {
                    this.currentSlide++;
                    this.sign = '-';
                    this.updatePosition();
                    this.animSlides();
                } else {
                    this.currentSlide--;
                    this.sign = '+';
                    this.updatePosition();
                    this.animSlides();
                }
            }
        },
        updatePosition() {
            if (this.currentSlide > 2 && this.sign === '-') {
                // slider copy should be positionned after the original
                this.copyAfter = true;
                gsap.set(this.$refs.sliderCopy, { x: this.widthPercentage * this.nbSlides + '%' });
            } else if (this.currentSlide < 3 && this.sign === '+') {
                // slider copy should be positionned before the original
                this.copyAfter = false;
                gsap.set(this.$refs.sliderCopy, { x: '-100%' });
            }
        },
        animSlides() {
            gsap.to(this.$refs.slider, {
                x: this.sign + '=' + this.widthPercentage + '%',
                duration: 0.8,
                ease: 'power4.inOut',
                onComplete: () => {
                    if (this.currentSlide === this.nbSlides + 1) {
                        this.currentSlide = 1;
                        gsap.set(this.$refs.slider, { x: 0 });
                        this.copyAfter = false;
                        gsap.set(this.$refs.sliderCopy, { x: '-100%' });
                    } else if (this.currentSlide === -this.nbSlides + 2) {
                        this.currentSlide = 2;
                        gsap.set(this.$refs.slider, { x: -this.widthPercentage + '%' });
                        this.copyAfter = false;
                        gsap.set(this.$refs.sliderCopy, { x: '-100%' });
                    }
                }
            });
        },
        changeSlide() {
            if (this.cursorDirection === 'right') {
                this.nextSlides();
            } else if (this.cursorDirection === 'left') {
                this.prevSlides();
            }
        },
        nextSlides() {
            this.moveSlides(true);
        },
        prevSlides() {
            this.moveSlides(false);
        },
        unify(e) {
            return e.changedTouches ? e.changedTouches[0] : e;
        },
        lock(e) {
            if (this.hasMouse && !this.isMobile) return;
            this.x0 = this.unify(e).clientX;
            this.y0 = this.unify(e).clientY;
        },
        move(e) {
            if (!this.willSwipe) return;
            if (this.x0 || this.x0 === 0) {
                const dx = this.unify(e).clientX - this.x0;
                const s = Math.sign(dx);

                if (s === -1) {
                    this.nextSlides();
                } else if (s === 1) {
                    this.prevSlides();
                }

                this.x0 = null;
            }
        },
        moving(e) {
            if (!this.x0 || !this.y0) return;
            const actualx0 = this.unify(e).clientX;
            const actualy0 = this.unify(e).clientY;
            const distX = Math.abs(actualx0 - this.x0);
            const distY = Math.abs(actualy0 - this.y0);
            if (distY > distX) {
                this.willSwipe = false;
                return;
            }
            this.willSwipe = true;
            e.preventDefault();
        },
        mouseMove(e) {
            if (!this.hasMouse) {
                this.moving(e);
            } else {
                this.cursorMove(e);
            }
        },
        cursorMove(e) {
            this.setDirection();
        },
        hideCursor() {
            if (this.isMobile) return;
            this.over = false;
            this.$store.commit('cursor/setShowCursor', false);
        },
        showCursor() {
            if (this.isMobile) return;
            this.over = true;
            if (this.cursorIcon !== 'arrow-long') this.$store.commit('cursor/setIcon', 'arrow-long');
            this.$store.commit('cursor/setShowCursor', true);
            this.setDirection();
        },
        setDirection() {
            if (!this.over || this.isMobile) return;
            const posFromElement = this.mousePos.x - this.rect.left;
            const side = posFromElement - this.rect.width / 2;
            const direction = side < 0 ? 'left' : 'right';
            if (this.cursorDirection !== direction) {
                this.cursorDirection = direction;
                this.$store.commit('cursor/setIconRotation', direction);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper-buttons {
    display: flex;
    margin-top: 20px;
    .arrow-button {
        margin-right: 20px;
    }
}
.module-slider {
    overflow: hidden;
    padding: 60px 0;
}
.wrapper-slider {
    position: relative;
}

.slider {
    display: flex;
    justify-content: flex-start;
    margin: 0;
    user-select: none;
    > li {
        flex: 0 0 auto;
        width: 100%;
        margin-right: percentage(1/4);
        padding: 0 #{$gutter};
    }
    ::v-deep picture {
        user-select: none;
    }
    &.copy {
        position: absolute;
        top: 0;
        left: 0;
        transform: translate3d(-100%, 0, 0);
        justify-content: flex-end;
        &.is-after {
            justify-content: flex-start;
        }
    }
}

@media (min-width: $tablet) {
    .wrapper-slider {
        width: percentage(6/8);
        margin: 0 auto;
    }
    .slider {
        > li {
            margin-right: percentage(1/6);
        }
    }
    .wrapper-buttons {
        display: none;
    }
    .container {
        cursor: none;
    }
}
@media (min-width: $desktop-small) {
    .module-slider {
        padding: 100px 0;
    }
}
@media (min-width: $desktop) {
    .module-slider {
        padding: 160px 0;
    }
    .wrapper-slider {
        width: percentage(8/12);
    }
    .slider {
        > li {
            margin-right: percentage(1/8);
        }
    }
}
</style>
