<template>
    <div>
        <h1>
            {{ story.content.song_title }}
        </h1>
    </div>
</template>

<script>
export default {
    asyncData({ app, $config, error, route }) {
        return app.$storyapi
            .get(`cdn/stories/playlist/${route.params.uid}`, {
                version: $config.sBlokVersion
            })
            .then(res => {
                return res.data;
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
    }
};
</script>
