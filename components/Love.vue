<template>
    <div class="love lightmode">
        <Reveal name="love" class="container" :offset="{ top: 270, bottom: 250 }" hook>
            <div class="container-small">
                <div class="love-content">
                    <div class="wrapper-cols">
                        <div class="col-small content-pad wrapper-love-title">
                            <h4 ref="title" class="love-title" v-html="resolveRichText(data.love_title)" />
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
                            <div ref="intro" class="love-intro" v-html="resolveRichText(data.love_intro)" />
                            <div ref="projects" class="love-projects">
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
        </Reveal>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import Reveal from '~/components/Reveal';

export default {
    components: {
        Reveal
    },
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
    mounted() {
        gsap.set([this.$refs.title, this.$refs.intro, this.$refs.projects], {
            opacity: 0
        });

        this.tl = gsap.timeline({ paused: true });
        this.tl.addLabel('start');
        this.tl.to(
            this.$refs.title,
            {
                duration: 0.8,
                scale: 1,
                opacity: 1
            },
            'start'
        );
        this.tl.to(
            this.$refs.intro,
            {
                duration: 0.8,
                delay: 0.2,
                opacity: 1
            },
            'start'
        );
        this.tl.to(
            this.$refs.projects,
            {
                duration: 0.8,
                delay: 0.4,
                opacity: 1
            },
            'start'
        );
    },
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        },
        loveIn() {
            this.tl.play();
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
        padding: 140px 0;
    }
}
@media (min-width: $desktop-large) {
    .project-name {
        font-size: 2.5rem;
        line-height: 32px;
    }
}
</style>
