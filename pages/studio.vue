<template>
    <div class="studio">
        <div class="studio-hero">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-cols">
                        <div class="col-small content-pad">
                            <h1 class="studio-title">{{ studio.title }}</h1>
                        </div>
                        <div class="col-large content-pad">
                            <div class="studio-subtitle" v-html="subtitle" />
                        </div>
                    </div>
                </div>
                <div v-if="isL">
                    <Stickers :line-one="studio.stickers_line_one" :line-two="studio.stickers_line_two" />
                </div>
            </div>
        </div>
        <Services :data="services" />
        <Work :data="studio" />
        <Love :data="studio" />
        <Fun :data="studio" />
        <div class="container container-footer">
            <div class="container-small">
                <div class="wrapper-footer content-pad">
                    <Footer />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ app, $config, error }) {
        const studio = await app.$storyapi
            .get('cdn/stories/studio', {
                version: $config.sBlokVersion,
                resolve_relations: 'service.projects,love_project.link'
            })
            .then(res => res.data.story.content)
            .catch(res => error({ statusCode: 404, message: 'Failed to receive content form api' }));

        const services = studio.services.map(service => {
            service.projects.map(async project => {
                const expertises = await app.$storyapi
                    .get('cdn/stories', {
                        version: $config.sBlokVersion,
                        by_uuids: project.content.expertises.join(',')
                    })
                    .then(res => res.data.stories)
                    .catch(res => {
                        console.error(res);
                        error({ statusCode: 404, message: 'Failed to receive content form api' });
                    });
                project.content.expertises = expertises;
                return project;
            });
            return service;
        });

        return { studio, services };
    },
    computed: {
        isL() {
            if (!this.$store.state.superWindow) return true;
            return this.$store.state.superWindow.width >= this.$breakpoints.list.l;
        },
        subtitle() {
            return this.$storyapi.richTextResolver.render(this.studio.subtitle);
        }
    }
};
</script>

<style lang="scss" scoped>
.studio-hero {
    padding: 110px 0 30px;
}
.studio-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 3.5rem;
    line-height: 42px;
    margin: 0;
}
.studio-subtitle {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin-top: 20px;
}
@media (min-width: $tablet) {
    .studio-hero {
        padding: 180px 0 30px;
    }
    .studio-title {
        font-size: 5rem;
        line-height: 60px;
    }
}
@media (min-width: $desktop-small) {
    .container-footer {
        background-color: transparent;
    }
    .studio-hero {
        padding: 245px 0 30px;
    }
    .studio-title {
        font-size: 7.5rem;
        font-weight: 100;
        line-height: 55px;
    }
    .studio-subtitle {
        font-size: 3rem;
        line-height: 37px;
        margin-top: 0;
    }
}
@media (min-width: $desktop) {
    .studio-title {
        font-size: 8.5rem;
        line-height: 65px;
    }
}
@media (min-width: $desktop-xxl) {
    .studio-title {
        font-size: 11rem;
        line-height: 80px;
    }
    .studio-subtitle {
        font-size: 3.5rem;
        line-height: 42px;
    }
}
</style>
