<template>
    <div class="home">
        <div class="home-hero">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-cols-home">
                        <div class="col-large-home content-pad">
                            <Hello class="primary color-secondary huge home-sticker" :appear="appearHello" />
                            <h1 class="home-title" v-html="homeTitle" />
                            <div class="expertises">
                                <div
                                    v-for="expertise in story.content.expertises"
                                    :key="expertise.id"
                                    class="expertise-wrapper"
                                >
                                    <div class="expertise">
                                        <span ref="expertises" class="expertise-inner">
                                            {{ expertise.name }}
                                        </span>
                                    </div>
                                    <span ref="expertisesLines" class="expertise-line" />
                                </div>
                            </div>
                        </div>
                        <div class="col-small-home content-pad">
                            <Slider :projects="story.content.projects" :appear="appearSlider" @change="changeTrack" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="home-footer">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-footer content-pad">
                        <Playlist
                            v-if="currentTrack && currentTrack.url"
                            :track="currentTrack"
                            :appear="appearTrack"
                            @loaded="trackLoaded"
                        />
                        <Footer theme="ultra-light" />
                    </div>
                </div>
            </div>
        </div>
        <Overlay />
    </div>
</template>

<script>
import { gsap } from 'gsap';
import tracks from '~/app/tracks.json';
import { basic } from '~/assets/js/transitions';

export default {
    asyncData({ app, $config, error }) {
        return app.$storyapi
            .get('cdn/stories/home', {
                version: $config.sBlokVersion,
                resolve_relations: 'home.projects,home.expertises'
            })
            .then(res => {
                return res.data;
            })
            .catch(res => {
                if (!res.response) {
                    console.error(res);
                    error({ statusCode: 404, message: 'Failed to receive content form api' });
                } else {
                    console.error(res.response.data);
                    error({ statusCode: res.response.status, message: res.response.data });
                }
            });
    },
    data: () => ({
        currentTrack: null,
        appearHello: false,
        appearSlider: false,
        appearTrack: false
    }),
    computed: {
        tracks() {
            return tracks;
        },
        homeTitle() {
            return this.$options.filters.splitInWords(this.$storyapi.richTextResolver.render(this.story.content.title));
        }
    },
    transition: basic,
    created() {
        this.changeTrack(this.story.content.projects[0].content.spotify_id);
    },
    methods: {
        changeTrack(uri) {
            this.currentTrack = this.tracks.find(track => {
                return track.uri === uri;
            });
        },
        trackLoaded() {
            this.appearHello = true;
            this.$store.commit('layout/setOverlay', false);
            this.$store.commit('layout/setHeader', true);
            this.$store.commit('layout/setFooter', true);
            const letters = this.$el.querySelectorAll('.home-title .word');

            const tl = gsap.timeline({ delay: 0.7 });
            tl.to(
                letters,
                {
                    duration: 1.2,
                    rotateX: 0,
                    opacity: 1,
                    ease: 'expo.out',
                    stagger: 0.03
                },
                'title'
            );
            tl.to(
                this.$refs.expertises,
                {
                    duration: 1.2,
                    rotateX: 0,
                    opacity: 1,
                    ease: 'expo.out',
                    stagger: 0.15
                },
                'title+=0.8'
            );
            tl.to(
                this.$refs.expertisesLines,
                {
                    duration: 1.2,
                    scaleX: 1,
                    ease: 'expo.out',
                    stagger: 0.15
                },
                'title+=1'
            );
            tl.add(() => {
                this.appearSlider = true;
                this.appearTrack = true;
            }, 'title+=1');
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
}
.col-large-home {
    margin-bottom: 60px;
}
.home-hero {
    padding: 110px 0 38px;
}
.home-sticker {
    margin-bottom: 50px;
}

.home-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 3.5rem;
    line-height: 42px;
    perspective: 5000px;
    ::v-deep .word {
        display: inline-block;
        transform-origin: 50% 50% -20px;
        transform: rotateX(80deg);
        opacity: 0;
        backface-visibility: hidden;
        // will-change: transform;
    }
    ::v-deep b,
    ::v-deep strong {
        font-weight: 400;
        color: $grey-3;
    }
    ::v-deep br {
        display: none;
    }
}
.expertises {
    margin-top: 65px;
}
.expertise-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: $telegraf;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 17px;
}

.expertise {
    perspective: 100px;
    perspective-origin: 50% 50%;
    padding: 20px 0;
}
.expertise-inner {
    display: inline-block;
    transform-origin: 50% 50% -8px;
    transform: rotateX(80deg);
    opacity: 0;
}

.expertise-line {
    display: block;
    height: 1px;
    width: 100%;
    background-color: #313131;
    transform-origin: 0% 0%;
    transform: scaleX(0);
}

@media (min-width: $tablet) {
    .home-hero {
        padding: 170px 0 32px;
    }
}
@media (min-width: $desktop-small) {
    .wrapper-cols-home {
        display: flex;
        // align-items: flex-start;
        align-items: stretch;
        justify-content: space-between;
    }
    .col-large-home {
        width: percentage(4/8);
        margin-bottom: 80px;
    }
    .col-small-home {
        width: percentage(3/8);
    }
    .home-title {
        font-size: 4.6rem;
        font-weight: 100;
        line-height: 59px;
        ::v-deep b,
        ::v-deep strong {
            font-weight: 100;
        }
    }
}
@media (min-width: $desktop) {
    .col-large-home {
        width: percentage(5/10);
    }
    .col-small-home {
        width: percentage(4/10);
    }
}
@media (min-width: $desktop-xxl) {
    .home-title {
        ::v-deep br {
            display: block;
        }
    }
}
</style>
