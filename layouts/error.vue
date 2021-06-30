<template>
    <div class="e404">
        <div class="wrapper-e404-title">
            <h1 class="e404-title">
                <span class="wrapper-title">
                    <span ref="title">{{ errorPage.title }}&nbsp;</span>
                </span>
            </h1>
        </div>
        <div class="container">
            <div class="e404-container container-small">
                <div class="wrapper-content-e404">
                    <div class="content-txt content-pad">
                        <h2 class="e404-subtitle" v-html="subtitle" />
                    </div>
                    <div class="content-playlist">
                        <Playlist
                            v-if="currentTrack && currentTrack.url"
                            class="error-playlist"
                            :track="currentTrack"
                        />
                    </div>
                </div>
                <div class="e404-btn content-pad">
                    <Button icon class="primary" :link="'/'"> Retour à l'accueil </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import tracks from '~/app/tracks.json';

export default {
    async asyncData({ app, $config, error }) {
        const errorPage = await app.$storyapi
            .get('cdn/stories/error', {
                version: $config.sBlokVersion
            })
            .then(res => res.data.story.content)
            .catch(res => error({ statusCode: 404, message: 'Failed to receive content form api' }));

        return { errorPage };
    },
    data: () => ({
        currentTrack: null
    }),
    computed: {
        subtitle() {
            return this.$storyapi.richTextResolver.render(this.errorPage.subtitle);
        },
        tracks() {
            return tracks;
        }
    },
    mounted() {
        this.currentTrack = this.tracks.find(track => {
            return track.uri === this.errorPage.spotify_id;
        });

        // clone title
        const title = this.$refs.title;
        const titleCopy = title.cloneNode(true);
        title.after(titleCopy);
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
.e404 {
    min-height: 100vh;
}

.wrapper-e404-title {
    overflow: hidden;
}
.e404-title {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    white-space: nowrap;
    font-family: $telegraf;
    font-weight: 100;
    font-size: 48vw;
    line-height: 0.44em;
    padding: 0.83em 0 0.56em;
}
.wrapper-title {
    backface-visibility: hidden;
    transform-style: preserve-3d;
    animation: scrollText 30s infinite linear;
}

.error-playlist {
    padding: 0 $gutter;
}

@keyframes scrollText {
    from {
        transform: translate3d(0%, 0, 0);
    }
    to {
        transform: translate3d(-50%, 0, 0);
    }
}

.e404-container {
    position: relative;
    padding: 30px 0 40px;
    &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
    }
}
.e404-subtitle {
    margin: 0;
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    text-align: center;
    color: $grey-4;
    > br {
        display: none;
    }
}
.content-playlist {
    display: flex;
    justify-content: center;
    margin: 30px 0 40px;
}
.e404-btn {
    display: flex;
    justify-content: center;
}

@media (min-width: $tablet) {
    .e404-title {
        font-size: 40vw;
        line-height: 0.42em;
        padding: 0.8em 0 0.54em;
    }
    .e404-container {
        padding: 50px 0 60px;
    }
    .wrapper-content-e404 {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        margin-bottom: 30px;
    }
    .content-txt {
        width: percentage(4/8);
    }
    .content-playlist {
        width: percentage(4/8);
        margin: 0;
    }
    .e404-subtitle {
        text-align: left;
        > br {
            display: block;
        }
    }
    .content-playlist {
        justify-content: flex-start;
    }
    .e404-btn {
        justify-content: flex-start;
    }
}

@media (min-width: $desktop-small) {
    .e404-title {
        font-size: 35vw;
        line-height: 0.4em;
        padding: 0.75em 0 0.53em;
    }
    .e404-subtitle {
        font-size: 3rem;
        line-height: 37px;
    }
}

@media (min-width: $desktop) {
    .e404-title {
        font-size: 30vw;
        line-height: 0.38em;
        padding: 0.7em 0 0.52em;
    }
    .content-txt {
        width: percentage(5/10);
    }
    .content-playlist {
        width: percentage(5/10);
    }
}

@media (min-width: $desktop-large) {
    .e404-title {
        font-size: 24vw;
        line-height: 0.35em;
        padding: 0.66em 0 0.51em;
    }
    .e404-subtitle {
        font-size: 3.5rem;
        line-height: 42px;
    }
    .content-playlist {
        padding-right: calc(#{percentage(2/10)} + #{$gutter});
    }
}
</style>
