<template>
    <div class="container">
        <div>
            <Logo />
            <h1 class="title">lesindiens</h1>
            <div v-html="$prismic.asHtml(intro)" />
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ $prismic }) {
        const document = await $prismic.api
            .query($prismic.predicates.at('document.type', 'home'))
            .then(doc => doc.results[0].data);
        return document;
    }
};
</script>

<style>
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
        Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
}

.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}

.links {
    padding-top: 15px;
}
</style>
