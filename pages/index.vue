<template>
    <div class="home">
        <div class="home-hero">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-cols-home">
                        <div class="col-large-home content-pad">
                            <Button v-slot="scope" class="primary color-secondary huge home-sticker">
                                <div class="wrapper-illus-txt">
                                    <Sprite
                                        class="cat"
                                        :cols="60"
                                        :rows="1"
                                        :interval="0.03"
                                        :loop="true"
                                        url="img/cat.png"
                                        @load="scope.computeRect"
                                    />
                                    <img src="~static/img/hello.svg" alt="Hello !" @load="scope.computeRect" />
                                </div>
                            </Button>
                            <h1 class="home-title" v-html="$storyapi.richTextResolver.render(story.content.title)" />
                            <div class="expertises">
                                <div
                                    v-for="expertise in story.content.expertises"
                                    :key="expertise.id"
                                    class="expertise"
                                >
                                    {{ expertise.name }}
                                </div>
                            </div>
                        </div>
                        <div class="col-small-home content-pad">
                            <Slider :projects="story.content.projects" @change="changeUri" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="home-footer">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-footer content-pad">
                        <Playlist v-if="currentTrack" :track="currentTrack" />
                        <Footer theme="ultra-light" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
        currentTrack: null
    }),
    computed: {
        tracks() {
            return this.$store.getters['playlist/getTracks'];
        }
    },
    mounted() {
        this.currentUri = this.story.content.projects[0].content.spotify_id;
    },
    methods: {
        changeUri(uri) {
            this.currentTrack = this.tracks.find(track => {
                return track.uri === uri;
            });
            console.log(this.tracks);
            console.log('this.currentTrack : ' + this.currentTrack);
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
    .wrapper-illus-txt {
        display: flex;
        align-items: center;
    }
}
.cat {
    flex: 0 0 auto;
    width: 59px;
    height: 87px;
    margin: -40px 20px 0 0;
}
.home-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 3.5rem;
    line-height: 42px;
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
.expertise {
    padding: 20px 0;
    font-family: $telegraf;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 17px;
    border-bottom: 1px solid #313131;
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
