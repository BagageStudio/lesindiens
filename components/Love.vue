<template>
    <div class="love lightmode">
        <div class="container">
            <div class="container-small">
                <div class="love-content">
                    <div class="wrapper-cols">
                        <div class="col-small content-pad wrapper-love-title">
                            <h4 class="love-title" v-html="resolveRichText(data.love_title)" />
                            <Button
                                v-if="data.trustfolio_link"
                                icon
                                class="primary align-top trustfolio-link"
                                :link="data.trustfolio_link.url"
                                target="_blank"
                                rel="noopener nofollow noreferrer"
                            >
                                <span class="txt-pre">Voir leur avis</span>
                                <img src="~static/img/trustfolio.svg" alt="Trustfolio" />
                            </Button>
                        </div>
                        <div class="col-large content-pad">
                            <div class="love-intro" v-html="resolveRichText(data.love_intro)" />
                            <div class="love-projects">
                                <div v-for="project in data.love_projects" :key="project._uid" class="love-project">
                                    <component
                                        :is="project.link ? 'nuxt-link' : 'div'"
                                        :to="project.link ? project.link.full_slug : ''"
                                        class="love-project-content"
                                    >
                                        <span class="project-name">{{ project.label }}</span>
                                    </component>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true }
    },
    data: () => ({}),
    computed: {
        isL() {
            if (!this.$store.state.superWindow) return true;
            return this.$store.state.superWindow.width >= this.$breakpoints.list.l;
        }
    },
    watch: {},
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        }
    }
};
</script>

<style lang="scss" scoped>
.love {
    padding: 60px 0;
    color: $black;
    background-color: $white;
}
.love-content {
    position: relative;
    padding: 36px 0 0;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
    }
}
.wrapper-love-title {
    margin-bottom: 40px;
}
.love-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin-bottom: 28px;
    :v-deep br {
        display: none;
    }
}
.trustfolio-link {
    transform: rotateZ(-1deg);
}
.love-intro {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 30px;
    margin-bottom: 30px;
}
.love-projects {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    width: calc(100% + #{2 * $gutter});
    margin-left: -$gutter;
}
.love-project {
    width: calc(50% - #{2 * $gutter});
    margin: 0 #{$gutter} 5px;
    &:nth-last-child(-n + 2) {
        margin-bottom: 0;
    }
}
.love-project-content {
    display: inline-flex;
    max-width: 100%;
    text-decoration: none;
}
.project-name {
    font-family: $object;
    font-weight: 400;
    font-size: 2rem;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (min-width: $desktop-small) {
    .love {
        padding: 100px 0;
    }
    .love-content {
        padding-top: 45px;
    }
    .wrapper-love-title {
        margin-bottom: 0;
    }
    .love-title {
        font-size: 3.5rem;
        line-height: 42px;
        margin-bottom: 30px;
        :v-deep br {
            display: block;
        }
    }
}
@media (min-width: $desktop) {
    .love {
        padding: 160px 0;
    }
    .love-content {
        padding-top: 80px;
    }
}
@media (min-width: $desktop-large) {
    .project-name {
        font-size: 2.5rem;
        line-height: 32px;
    }
}
</style>
