<template>
    <div ref="glWrapper" class="gl-wrapper" />
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
    },
    mounted() {
        this.$webgl.init({
            dom: this.$refs.glWrapper
        });
        this.$nextTick(() => {
            const projects = this.story.content.projects.map(p =>
                p.content.image.filename.replace('a.storyblok', 's3.amazonaws.com/a.storyblok')
            );
            this.$webgl.addMedias([...projects, ...projects, ...projects]);
        });
    }
};
</script>

<style lang="scss" scoped>
.gl-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
}
</style>
