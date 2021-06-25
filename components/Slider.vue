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
                    <span class="name">{{ projects[current].name }}</span>
                </nuxt-link>
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
        this.initSlider();
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
        initSlider() {
            const img = this.$refs.image[this.current];
            gsap.set(img, {
                opacity: 1
            });
            gsap.set(img.querySelector('.js-image-inner'), {
                scale: 1
            });
            this.$nextTick(() => {
                this.timeoutAutoplay();
            });
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
            console.log(this.projects[this.current].content.spotify_id);
            this.$emit('change', this.projects[this.current].content.spotify_id);
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
            const title = this.$refs.nav.querySelector('.name');
            const tl = gsap.timeline({
                paused: true,
                onComplete:
                    dir === 'in'
                        ? () => {
                              this.transitionning = false;
                          }
                        : null
            });
            const txts = [title].filter(el => el);
            if (dir === 'in') txts.reverse();
            tl.fromTo(
                txts,
                {
                    y: dir === 'in' ? 10 : 0,
                    opacity: dir === 'in' ? 0 : 1
                },
                {
                    duration: 0.8,
                    stagger: 0.1,
                    y: dir === 'out' ? 10 : 0,
                    opacity: dir === 'out' ? 0 : 1,
                    ease: 'power3.out'
                }
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
    height: 335px;
}

.images {
    position: relative;
    flex: 0 1 100%;
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

.nav {
    padding: 25px 0;
}
.inner-nav {
    display: flex;
    justify-content: space-between;
}
.nav-link {
    text-decoration: none;
}
.name {
    text-decoration: none;
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 30px;
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

@media (min-width: $phone) {
    .slider {
        height: 435px;
    }
}
@media (min-width: $tablet) {
    .slider {
        height: 535px;
    }
}
@media (min-width: $desktop-small) {
    .slider {
        height: 100%;
    }
    .wrapper-buttons {
        display: none;
    }
    .images {
        cursor: none;
    }
}
</style>
