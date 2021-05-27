<template>
    <div class="type">
        <div class="type-hero">
            <div class="container">
                <div class="container-small">
                    <h1 class="type-title content-pad">{{ page[0].content.title }}</h1>
                </div>
            </div>
        </div>
        <div v-if="page[0].content.content" class="container">
            <div class="container-small">
                <div class="content-pad wysiwyg" v-html="resolveRichText(page[0].content.content)" />
            </div>
        </div>
        <component :is="module.component" v-for="module in page[0].content.modules" :key="module._uid" :data="module" />
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
    async asyncData({ app, $config, error, route }) {
        const page = await app.$storyapi
            .get('cdn/stories', {
                version: $config.sBlokVersion,
                by_slugs: route.params.slug
            })
            .then(res => {
                return res.data.stories;
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
        return { page };
    },
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        }
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
.type-hero {
    padding: 110px 0 50px;
}
.type-title {
    font-family: $telegraf;
    font-size: 6.5rem;
    line-height: 1;
    font-weight: 100;
}
@media (min-width: $tablet) {
    .type-hero {
        padding: 180px 0 50px;
    }
    .type-title {
        font-size: 9rem;
        line-height: 80px;
    }
}
@media (min-width: $desktop-small) {
    .type-hero {
        padding: 245px 0 50px;
    }
}
</style>