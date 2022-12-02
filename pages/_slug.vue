<template>
    <div class="type">
        <div class="type-hero">
            <div class="container">
                <div class="container-small">
                    <h1 class="type-title content-pad" v-html="$options.filters.splitInWords(page[0].content.title)" />
                    <Playlist
                        v-if="currentTrack && currentTrack.url"
                        class="type-playlist"
                        :track="currentTrack"
                        :appear="playlistShow"
                        @loaded="trackLoaded"
                    />
                </div>
            </div>
        </div>
        <div v-if="page[0].content.content" class="container">
            <div class="container-small">
                <div class="content-pad wysiwyg" v-html="resolveRichText(page[0].content.content)" />
            </div>
        </div>
        <component :is="module.component" v-for="module in page[0].content.modules" :key="module._uid" :data="module" />
        <div class="container container-footer">
            <div class="container-small">
                <div class="wrapper-footer content-pad">
                    <Footer />
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
    transition: basic,
    async asyncData({ app, $config, error, route }) {
        const page = await app.$storyapi
            .get('cdn/stories', {
                version: $config.sBlokVersion,
                by_slugs: route.params.slug
            })
            .then(res => {
                return res.data.stories;
            })
            .catch(res => {
                if (!res.response) {
                    console.error(res);
                    error({ statusCode: 404, message: 'Failed to receive content from api' });
                } else {
                    console.error(res.response.data);
                    error({ statusCode: res.response.status, message: res.response.data });
                }
            });

        let currentTrack = null;

        if (page[0].content.spotify_id) {
            currentTrack = tracks.find(track => {
                return track.uri === page[0].content.spotify_id;
            });
        }
        return { page, currentTrack };
    },
    data: () => ({
        currentTrack: null,
        playlistShow: false
    }),
    computed: {
        tracks() {
            return tracks;
        }
    },
    mounted() {
        if (!this.currentTrack || !this.currentTrack.url) this.trackLoaded();
    },
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        },
        trackLoaded() {
            this.$store.commit('layout/setOverlay', false);
            this.$store.commit('layout/setHeader', true);
            this.$store.commit('layout/setFooter', true);

            const letters = this.$el.querySelectorAll('.type-title .word');

            const tl = gsap.timeline();
            tl.to(
                letters,
                {
                    duration: 1.2,
                    rotateX: 0,
                    opacity: 1,
                    ease: 'expo.out',
                    stagger: 0.2
                },
                'title'
            ).add(() => {
                this.playlistShow = true;
            }, 'title+=0.9');
        }
    },
    head() {
        return {
            htmlAttrs: {
                class: 'lightmode'
            }
        };
    }
};
</script>

<style lang="scss" scoped>
.type-hero {
    padding: 110px 0 50px;
}
.type-title {
    font-family: $telegraf;
    font-size: 6.5rem;
    line-height: 1;
    font-weight: 100;
    perspective: 5000px;
    ::v-deep .word {
        display: inline-block;
        transform-origin: 50% 50% -20px;
        transform: rotateX(80deg);
        opacity: 0;
    }
}
.type-playlist {
    margin-top: 30px;
    padding: 0 $gutter;
}
@media (min-width: $tablet) {
    .type-hero {
        padding: 180px 0 50px;
    }
    .type-title {
        font-size: 9rem;
        line-height: 80px;
    }
}
@media (min-width: $desktop-small) {
    .type-hero {
        padding: 245px 0 50px;
    }
    .type-playlist {
        margin-top: 50px;
    }
}
</style>
