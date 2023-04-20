<template>
    <div class="home">
        <div class="home-hero">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-cols-home">
                        <div class="col-large-home content-pad">
                            <div class="wrapper-intro">
                                <Hello class="primary color-secondary huge home-sticker" :appear="appearHello" />
                                <h1 class="home-title" v-html="homeTitle" />
                            </div>
                            <Button
                                v-if="story.content.projects_link[0].link.story.full_slug"
                                ref="projectLink"
                                icon
                                class="primary project-link"
                                :link="story.content.projects_link[0].link.story.full_slug"
                                large
                            >
                                {{ story.content.projects_link[0].label }}
                            </Button>
                        </div>
                        <div class="col-small-home content-pad">
                            <Slider
                                :projects="story.content.projects"
                                :appear="appearSlider"
                                :discover-label="story.content.discover_label"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Overlay />
    </div>
</template>

<script>
import { gsap } from 'gsap';
import { basic } from '~/assets/js/transitions';
import handleSeo from '~/assets/js/seo';

export default {
    asyncData({ app, $config, error }) {
        return app.$storyapi
            .get('cdn/stories/home', {
                version: $config.sBlokVersion,
                resolve_relations: 'home.projects',
                resolve_links: 'url'
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
        appearHello: false,
        appearSlider: false
    }),
    computed: {
        homeTitle() {
            return this.$options.filters.splitInWords(this.$storyapi.richTextResolver.render(this.story.content.title));
        }
    },
    mounted() {
        this.reveal();
    },
    methods: {
        reveal() {
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
                '.project-link',
                {
                    duration: 1.2,
                    rotateX: 0,
                    opacity: 1,
                    ease: 'expo.out'
                },
                'title+=0.8'
            );
            tl.add(() => {
                this.appearSlider = true;
            }, 'title+=1');
        }
    },
    head() {
        return {
            ...handleSeo({ route: this.$route.fullPath, data: this.story.content })
        };
    },
    transition: basic
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
.project-link {
    opacity: 0;
    margin-top: 30px;
}

@media (min-width: $tablet) {
    .home-hero {
        padding: 170px 0 32px;
    }
}
@media (min-width: $desktop-small) {
    .home {
        padding-top: 110px;
        justify-content: center;
    }
    .home-hero {
        padding-top: 60px;
        padding-bottom: 60px;
    }
    .wrapper-cols-home {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
    }
    .col-large-home {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: percentage(4/8);
        margin-bottom: 0;
    }
    .col-small-home {
        width: percentage(3/8);
    }
    .home-title {
        width: 100%;
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
