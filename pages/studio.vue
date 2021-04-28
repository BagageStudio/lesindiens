<template>
    <div class="studio">
        <div class="studio-hero">
            <div class="container">
                <div class="container-small">
                    <h1 class="h1 content-pad">{{ studio.title }}</h1>
                    <div class="subtitle studio-subtitle content-pad" v-html="subtitle" />
                </div>
            </div>
        </div>
        <Services :data="services" />
        <Work :data="studio" />
    </div>
</template>

<script>
export default {
    async asyncData({ app, $config, error }) {
        const studio = await app.$storyapi
            .get('cdn/stories/studio', {
                version: $config.sBlokVersion,
                resolve_relations: 'service.projects'
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
        subtitle() {
            return this.$storyapi.richTextResolver.render(this.studio.subtitle);
        }
    }
};
</script>

<style>
.studio-hero {
    padding: 110px 0 50px;
}
.studio-subtitle {
    margin-top: 20px;
}
</style>
