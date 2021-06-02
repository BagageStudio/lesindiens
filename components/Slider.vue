<template>
    <div class="slider">
        <div ref="slider" class="images" @click="clickCursor(iconDirection)">
            <!-- <div
            ref="slider"
            class="images"
            @click="clickCursor(iconDirection)"
            @mouseenter="imIn"
            @mouseleave="imOut"
            @mousemove="mouseMove"
        > -->
            <div v-for="s in projects" ref="image" :key="s.id" class="image">
                <FastImage class="js-image-inner" :image="s.content.image" cover />
                <!-- <img
                    v-if="!objectFitFallback"
                    v-imageLoaded
                    class="js-image-inner"
                    :srcset="getSrcSet(s.image)"
                    :sizes="getSizesAttr()"
                    :alt="s.title"
                />
                <span
                    v-if="objectFitFallback"
                    class="image-fallback js-image-inner"
                    :style="{ backgroundImage: `url(/slides/${s.image})` }"
                /> -->
            </div>
        </div>
        <div class="nav">
            <div ref="nav" class="inner-nav">
                <nuxt-link :to="projects[current].full_slug">
                    <span class="name">{{ projects[current].name }}</span>
                </nuxt-link>
                <!-- <a
                        v-if="slides[current].url"
                        :href="slides[current].url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="wrapper-infos"
                    >
                        <span class="category">{{ slides[current].cat }}</span>
                        <div class="infos">
                            <span class="name">{{ slides[current].title }}</span>
                            <Icon name="link" />
                        </div>
                    </a>
                    <div v-else class="wrapper-infos">
                        <span class="category">{{ slides[current].cat }}</span>
                        <div class="infos">
                            <span class="name">{{ slides[current].title }}</span>
                        </div>
                    </div> -->
                <div class="arrows">
                    <button aria-label="Projet précédent" class="prev" @click="changeSlide('left')">
                        <Icon name="chevron" />
                    </button>
                    <button aria-label="Projet suivant" class="next" @click="changeSlide('right')">
                        <Icon name="chevron" />
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
        imagesSizes: [580, 780, 960, 1630],
        slides: []
    }),
    computed: {
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
        showCursor() {
            return this.$store.state.cursor.showCursor;
        },
        iconDirection() {
            return this.$store.state.cursor.iconDirection;
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
    created() {
        // this.slides = this.$store.getters.getSlides;
        this.totalNumber = this.projects.length - 1;
    },
    mounted() {
        this.rect = this.$refs.slider.getBoundingClientRect();
        this.initSlider();
    },
    methods: {
        // getSrc(imageName) {
        //     const size = this.imagesSizes[this.imagesSizes.length - 1];
        //     return `slides/${size}/${imageName}`;
        // },
        // getSrcSet(imageName) {
        //     return this.imagesSizes.map(size => `slides/${size}/${imageName} ${size}w`).join(', ');
        // },
        // getSizesAttr() {
        //     return this.imagesSizes.map(size => `(max-width: ${size}px) ${size}px`).join(', ');
        // },
        clickCursor(d) {
            if (!this.isL) return;
            this.changeSlide(d);
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
        changeSlide(direction) {
            if (this.autoPlayTimeout) clearRequestTimeout(this.autoPlayTimeout);
            if (this.transitionning) return;
            EventBus.$emit('back');
            this.transitionning = true;
            if (direction === 'left') {
                this.nextSlide(-1);
            } else {
                this.nextSlide(1);
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
            console.log('next slide');
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
        mouseMove() {
            if (!this.showCursor && this.isL) this.$store.commit('cursor/setShowCursor', true);
            this.over = true;
            this.setDirection();
        },
        setDirection() {
            if (!this.over) return;
            const posFromElement = this.mousePos.x - this.rect.left;
            const side = posFromElement - this.rect.width / 2;
            const direction = side < 0 ? 'left' : 'right';
            if (this.iconDirection !== direction) this.$store.commit('cursor/setIconDirection', direction);
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
            // const cat = this.$refs.nav.querySelector('.category');
            // const link = this.$refs.nav.querySelector('.icon-link');
            const tl = gsap.timeline({
                paused: true,
                onComplete:
                    dir === 'in'
                        ? () => {
                              this.transitionning = false;
                          }
                        : null
            });
            // const txts = [link, title, cat].filter(el => el);
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
    margin: 60px 0 0;
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

.arrows {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    max-width: 80px;
    button {
        color: $white;
        border: none;
        &.next {
            .icon {
                transform-origin: 50% 50%;
                transform: rotate(180deg);
            }
        }
        &:focus {
            outline: none;
        }
    }
    .icon {
        width: 9px;
        height: 18px;
    }
}

// @media (min-width: $tablet) {
//     .slider {
//         width: calc(100% + 80px);
//         margin-left: -40px;
//     }
// }

@media (min-width: $desktop-small) {
    .slider {
        // position: fixed;
        // bottom: 0;
        // right: 0;
        // height: auto;
        // width: calc(((100% - 80px) * 7 / 12) + 30px);
        height: 100%;
        margin: 0;
    }
    .arrows {
        display: none;
    }
    .images {
        cursor: none;
    }
}

@media (min-width: $desktop-large) {
    // .slider {
    //     width: calc(((100% - 180px) * 7 / 12) + 80px);
    //     // top: $header-height-big;
    // }
}

@media (min-width: $desktop-xxl) {
    // .slider {
    //     width: calc(((100% - 180px) * 8 / 12) + 80px);
    // }
}
</style>
