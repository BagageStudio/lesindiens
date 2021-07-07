<template>
    <div class="projects">
        <nuxt-link v-for="project in data" :key="project.id" :to="project.full_slug" class="project">
            <div class="wrapper-img">
                <FastImage class="project-image" :image="project.content.image" cover />
            </div>
            <div class="project-details">
                <div class="project-title" v-html="resolveRichText(project.content.song_title)" />
                <div class="project-infos">
                    <div class="project-info">
                        <span class="info-title">Client</span>
                        <span class="info-content">{{ project.content.name }}</span>
                    </div>
                    <div class="project-info">
                        <span class="info-title">Expertise</span>
                        <Tags class="grey" :tags="project.content.expertises" />
                    </div>
                </div>
            </div>
        </nuxt-link>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Array, required: true }
    },
    data: () => ({}),
    watch: {},
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper-img {
    position: relative;
    background: $grey-5;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transition: clip-path 0.2s ease-in-out;
    &::before {
        content: '';
        display: block;
        padding-bottom: 100%;
    }
    .project-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.projects {
    margin-top: 40px;
}
.project {
    text-decoration: none;
    &:nth-child(n + 2) {
        display: none;
    }
    &:hover {
        .wrapper-img {
            clip-path: polygon(0 28px, 100% 0, 100% 100%, 0 calc(100% - 20px));
        }
        .project-image {
            transform: scale(1.03);
        }
    }
}
.project-details {
    margin-top: 30px;
}
.project-title {
    display: block;
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    ::v-deep br {
        display: none;
    }
}
.project-info {
    display: flex;
    align-items: baseline;
    margin-top: 15px;
}
.info-title {
    font-family: $object;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 13px;
    margin-right: 10px;
    color: $grey-3;
}
.info-content {
    font-family: $object;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 13px;
}

@media (min-width: $tablet) {
    .projects {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + #{2 * $gutter});
        margin-left: -#{$gutter};
    }
    .project {
        width: calc(50% - #{2 * $gutter});
        margin: 0 #{$gutter};
        &:nth-child(n + 2) {
            display: block;
        }
    }
}
</style>
