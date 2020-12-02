<template>
    <div>{{ song_title }}</div>
</template>

<script>
export default {
    async asyncData({ $prismic, params: { uid } }) {
        const content = await $prismic.api
            .query($prismic.predicates.at('my.project.uid', uid))
            .then(doc => doc.results[0].data);
        return content;
    }
};
</script>
