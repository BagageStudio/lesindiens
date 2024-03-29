<template>
    <div class="slider">
        <div
            ref="slider"
            class="images"
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
            <div v-for="s in projects" ref="image" :key="s.id" class="image">
                <FastImage class="js-image-inner" :image="s.content.thumbnail" cover />
            </div>
        </div>
        <div class="nav">
            <div ref="nav" class="inner-nav">
                <nuxt-link :to="projects[current].full_slug" class="nav-link">
                    <span class="name" v-html="$options.filters.splitInWords(projects[current].name)"
                /></nuxt-link>
                <div class="wrapper-discover">
                    <nuxt-link :to="projects[current].full_slug" class="discover-link">
                        <span>{{ discoverLabel }}</span>
                    </nuxt-link>
                </div>
                <div class="wrapper-buttons">
                    <button
                        class="btn-prev arrow-button"
                        type="button"
                        aria-label="Projet précédent"
                        @click="arrowChangeSlide(-1)"
                    >
                        <Icon name="arrow-long-left" />
                    </button>
                    <button
                        class="btn-next arrow-button"
                        aria-label="Projet suivant"
                        type="button"
                        @click="arrowChangeSlide(1)"
                    >
                        <Icon name="arrow-long" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { gsap } from 'gsap';
import { requestTimeout, clearRequestTimeout } from '@stereorepo/sac';
import { EventBus } from '~/assets/js/global';

export default {
    props: {
        projects: {
            type: Array,
            required: true
        },
        appear: {
            type: Boolean,
            required: true
        },
        discoverLabel: {
            type: String,
            required: true
        }
    },
    data: () => ({
        rect: null,
        over: false,
        current: 0,
        totalNumber: 0,
        transitionning: false,
        autoPlayTimeout: null,
        willSwipe: true
    }),
    computed: {
        ww() {
            if (!this.$store.state.superWindow) return false;
            return this.$store.state.superWindow.width;
        },
        isL() {
            if (!this.$store.state.superWindow) return false;
            return this.$store.state.superWindow.width >= this.$breakpoints.list.l;
        },
        resizing() {
            if (!this.$store.state.superWindow) return false;
            return this.$store.state.superWindow.resizing;
        },
        mousePos() {
            return this.$store.state.cursor.mousePos;
        },
        iconDirection() {
            return this.$store.state.cursor.iconDirection;
        },
        isMobile() {
            return this.ww <= this.$breakpoints.list.l;
        },
        cursorIcon() {
            return this.$store.state.cursor.icon;
        },
        hasMouse() {
            return this.$store.state.cursor.hasMouse;
        }
    },
    watch: {
        appear(appear) {
            if (!appear) return;
            const currentImage = this.$refs.image[this.current];
            const currentInner = currentImage.querySelector('.js-image-inner');
            const title = this.$refs.nav.querySelectorAll('.name .word');
            const discoverlink = this.$refs.nav.querySelectorAll('.wrapper-discover');
            const tl = gsap.timeline({
                onComplete: () => {
                    this.timeoutAutoplay();
                }
            });

            tl.fromTo(
                currentInner,
                {
                    scale: 1.2
                },
                {
                    duration: 1.2,
                    ease: 'expo.out',
                    scale: 1
                },
                'start'
            );
            tl.fromTo(
                currentImage,
                {
                    opacity: 0,
                    x: '100%'
                },
                {
                    duration: 1.2,
                    opacity: 1,
                    ease: 'expo.out',
                    x: 0
                },
                'start'
            );
            tl.fromTo(
                title,
                {
                    rotateX: 80,
                    opacity: 0
                },
                {
                    duration: 0.8,
                    stagger: 0.2,
                    rotateX: 0,
                    opacity: 1,
                    ease: 'expo.out'
                },
                'start+=0.8'
            );
            tl.to(
                discoverlink,
                {
                    duration: 0.4,
                    autoAlpha: 1,
                    ease: 'power2.out'
                },
                'start+=1'
            );
        },
        isL(is) {
            if (!is) {
                if (this.autoPlayTimeout) {
                    clearRequestTimeout(this.autoPlayTimeout);
                    this.autoPlayTimeout = null;
                }
                this.$store.commit('cursor/setShowCursor', false);
            } else {
                this.$nextTick(() => {
                    if (!this.autoPlayTimeout) this.timeoutAutoplay();
                });
            }
        },
        resizing(r) {
            if (r) return;
            this.rect = this.$refs.slider.getBoundingClientRect();
        }
    },
    beforeDestroy() {
        if (this.autoPlayTimeout) {
            clearRequestTimeout(this.autoPlayTimeout);
            this.autoPlayTimeout = null;
        }
    },
    created() {
        this.totalNumber = this.projects.length - 1;
    },
    mounted() {
        this.rect = this.$refs.slider.getBoundingClientRect();
    },
    methods: {
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
                    this.nextSlide(1);
                } else if (s === 1) {
                    this.nextSlide(-1);
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
        setDirection() {
            if (!this.over || this.isMobile) return;
            const posFromElement = this.mousePos.x - this.rect.left;
            const side = posFromElement - this.rect.width / 2;
            const direction = side < 0 ? 'left' : 'right';
            if (this.cursorDirection !== direction) {
                this.cursorDirection = direction;
                this.$store.commit('cursor/setIconRotation', direction);
            }
        },
        hideCursor() {
            if (this.isMobile) return;
            this.over = false;
            this.$store.commit('cursor/setShowCursor', false);
            this.cursorDirection = 'right';
            this.$store.commit('cursor/setIconRotation', 'right');
        },
        showCursor() {
            if (this.isMobile) return;
            this.over = true;
            this.$store.commit('cursor/setIcon', 'arrow-long');
            this.$store.commit('cursor/setShowCursor', true);
            this.setDirection();
        },
        arrowChangeSlide(direction) {
            if (this.autoPlayTimeout) clearRequestTimeout(this.autoPlayTimeout);
            if (this.transitionning) return;
            EventBus.$emit('back');
            this.transitionning = true;
            this.nextSlide(direction);
        },
        changeSlide(direction) {
            if (this.isMobile) return;
            if (this.autoPlayTimeout) clearRequestTimeout(this.autoPlayTimeout);
            if (this.transitionning) return;
            EventBus.$emit('back');
            this.transitionning = true;
            if (this.cursorDirection === 'right') {
                this.nextSlide(1);
            } else if (this.cursorDirection === 'left') {
                this.nextSlide(-1);
            }
        },
        manageZindex(nextIndex) {
            gsap.set(this.$refs.image, {
                zIndex: 0
            });
            gsap.set(this.$refs.image[nextIndex], {
                zIndex: 1
            });
        },
        getNextIndex(direction) {
            if (direction > 0) {
                return this.current + 1 > this.totalNumber ? 0 : this.current + 1;
            } else {
                return this.current - 1 < 0 ? this.totalNumber : this.current - 1;
            }
        },
        nextSlide(direction) {
            const nextIndex = this.getNextIndex(direction);

            this.manageZindex(nextIndex);
            const nextImage = this.$refs.image[nextIndex];
            const nextInner = nextImage.querySelector('.js-image-inner');
            const currentImage = this.$refs.image[this.current];
            const currentInner = currentImage.querySelector('.js-image-inner');
            const anim = this.slideTimeline(currentInner, currentImage, nextInner, nextImage, nextIndex, direction);
            const animNav = this.navTimeline();

            anim.play();
            animNav.play();
        },
        imIn() {
            if (!this.isL) return;
            this.over = true;
            this.setDirection();
            this.$store.commit('cursor/setShowCursor', true);
        },
        imOut() {
            if (!this.isL) return;
            this.over = false;
            this.$store.commit('cursor/setShowCursor', false);
        },
        timeoutAutoplay() {
            if (!this.isL) return;
            EventBus.$emit('startTimer');
            this.autoPlayTimeout = requestTimeout(() => {
                EventBus.$emit('reset');
                this.transitionning = true;
                this.nextSlide(1);
            }, 6000);
        },
        afterAnim(nextIndex) {
            this.current = nextIndex;
            this.$nextTick(() => {
                const nav = this.navTimeline('in');
                nav.play();
            });
        },
        navTimeline(dir = 'out') {
            const title = this.$refs.nav.querySelectorAll('.name .word');
            const discoverlink = this.$refs.nav.querySelectorAll('.wrapper-discover');
            const tl = gsap.timeline({
                paused: true,
                onComplete:
                    dir === 'in'
                        ? () => {
                              this.transitionning = false;
                          }
                        : null
            });
            const txts = [...title].filter(el => el);
            if (dir === 'out') txts.reverse();
            tl.fromTo(
                txts,
                {
                    rotateX: dir === 'in' ? 80 : 0,
                    opacity: dir === 'in' ? 0 : 1
                },
                {
                    duration: 0.8,
                    stagger: 0.1,
                    rotateX: dir === 'out' ? -80 : 0,
                    opacity: dir === 'out' ? 0 : 1,
                    ease: 'power3.out'
                },
                'desc'
            );
            tl.to(
                discoverlink,
                {
                    duration: 0.8,
                    autoAlpha: dir === 'out' ? 0 : 1,
                    ease: 'power3.out'
                },
                'desc'
            );
            return tl;
        },
        slideTimeline(currentInner, currentImage, nextInner, nextImage, nextIndex, dir) {
            const tl = gsap.timeline({
                paused: true
            });
            tl.fromTo(
                nextInner,
                {
                    scale: 1.2
                },
                {
                    duration: 1.2,
                    ease: 'power4.out',
                    scale: 1
                },
                'start'
            );
            tl.fromTo(
                currentInner,
                {
                    scale: 1
                },
                {
                    duration: 1.2,
                    ease: 'power4.out',
                    scale: 1.2
                },
                'start'
            );
            tl.fromTo(
                currentImage,
                {
                    opacity: 1,
                    x: 0
                },
                {
                    duration: 1.2,
                    ease: 'power4.out',
                    x: `${-50 * dir}%`,
                    opacity: 0
                },
                'start'
            );
            tl.fromTo(
                nextImage,
                {
                    opacity: 1,
                    x: `${100 * dir}%`
                },
                {
                    duration: 1.2,
                    ease: 'power4.out',
                    x: 0
                },
                'start'
            );
            tl.add(() => {
                this.afterAnim(nextIndex);
            }, 'start+=0.7');
            tl.add(() => {
                this.timeoutAutoplay();
            }, 'start+=1');
            return tl;
        }
    }
};
</script>
<style lang="scss" scoped>
.slider {
    display: flex;
    flex-direction: column;
}

.images {
    position: relative;
    flex: 0 1 100%;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
}

.image {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    transform-origin: 50% 50%;
    overflow: hidden;
    img {
        object-fit: cover;
        max-width: none;
        width: 100%;
        height: 100%;
        transform-origin: 50% 50%;
        transform: scale(1.2);
    }
}

.fast-image {
    display: block;
    width: 100%;
    height: 100%;
}

.nav {
    padding: 25px 0 0;
}
.inner-nav {
    display: flex;
    justify-content: space-between;
}
.nav-link {
    text-decoration: none;
}
.name {
    display: inline-block;
    text-decoration: none;
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    perspective: 500px;
    line-height: 1;
    ::v-deep .word {
        display: inline-block;
        opacity: 0;
        transform-origin: 50% 50% -20px;
        transform: rotateX(80deg);
    }
}
.wrapper-discover {
    display: none;
}
.wrapper-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    width: 100%;
    .arrow-button {
        margin-left: 20px;
    }
}

@media (min-width: $desktop-small) {
    .wrapper-discover {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-left: 30px;
        opacity: 0;
        visibility: hidden;
    }
    .wrapper-buttons {
        display: none;
    }
    .images {
        cursor: none;
    }
    .nav {
        padding-top: 38px;
    }
    .name {
        font-size: 2.5rem;
        line-height: 32px;
    }
    .discover-link {
        font-size: 1.4rem;
        line-height: 13px;
        color: $grey-3;
        text-decoration: none;
        transition: 0.2s ease-in-out;
        text-decoration: underline;
        text-decoration-color: $black;
        text-underline-offset: 4px;
        &:hover {
            color: $white;
            text-decoration-color: $white;
        }
    }
}
</style>
