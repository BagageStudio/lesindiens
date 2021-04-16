<template>
    <div class="container">
        <h1 v-html="$storyapi.richTextResolver.render(story.content.title)" />
        <div class="projects">
            <div v-for="p in story.content.projects" :key="p.id" class="project">
                <nuxt-link :to="p.full_slug">
                    {{ p.content.song_title }}
                </nuxt-link>
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
                resolve_relations: 'home.projects'
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
    }
};
</script>

<style></style>
