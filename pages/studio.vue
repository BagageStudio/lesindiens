<template>
    <div class="studio">
        <div class="studio-hero">
            <div class="container">
                <div class="container-small">
                    <h1 class="h1 content-pad">{{ story.content.title }}</h1>
                    <div class="subtitle studio-subtitle content-pad" v-html="subtitle" />
                </div>
            </div>
        </div>
        <Services :data="story.content.services" />
    </div>
</template>

<script>
export default {
    asyncData({ app, $config, error }) {
        return app.$storyapi
            .get('cdn/stories/studio', {
                version: $config.sBlokVersion
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
    computed: {
        subtitle() {
            return this.$storyapi.richTextResolver.render(this.story.content.subtitle);
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
