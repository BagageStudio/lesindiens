<template>
    <div>
        <div class="project-hero">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-project-title">
                        <h1 class="project-title content-pad" v-html="$options.filters.splitInWords(title)" />
                    </div>
                    <div class="project-hero-details">
                        <div class="project-infos content-pad">
                            <div class="project-info">
                                <span class="info-title info-item">{{ global.project_type_label }}</span>
                                <span class="info-content info-item">{{ currentProject.content.project_type }}</span>
                            </div>
                            <div class="project-info">
                                <span class="info-title info-item">Expertise</span>
                                <Tags :tags="currentProject.content.expertises" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="big-image">
            <FastImage
                ref="bigImage"
                :image="currentProject.content.image"
                full-width
                loading="eager"
                @loaded="imageIsLoaded = true"
            />
        </div>
        <ProjectIntro :project="currentProject" />
        <component :is="mod.component" v-for="mod in currentProject.content.modules" :key="mod.id" :data="mod" />
        <LinkedProjects :projects="twoOtherProjects" :global="global" />
        <div class="container">
            <div class="container-small">
                <div class="wrapper-footer content-pad">
                    <Footer theme="light" />
                </div>
            </div>
        </div>
        <Overlay />
    </div>
</template>

<script>
import { gsap } from 'gsap';
import { basic } from '~/assets/js/transitions';
import handleSeo from '~/assets/js/seo';

export default {
    transition: basic,
    async asyncData({ app, $config, error, route }) {
        const global = await app.$storyapi
            .get('cdn/stories/global', {
                version: $config.sBlokVersion
            })
            .then(res => {
                return res.data.story.content;
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

        const projects = await app.$storyapi
            .get('cdn/stories', {
                starts_with: 'projects/',
                version: $config.sBlokVersion,
                resolve_relations: 'expertises'
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
        const currentProject = projects.find(element => element.slug === route.params.uid);
        const otherProjects = projects.filter(element => element.slug !== route.params.uid && !element.is_startpage);
        // Randomly pick 2 projects
        const twoOtherProjects = [];
        for (let i = 0; i < 2; ) {
            const random = Math.floor(Math.random() * otherProjects.length);
            if (twoOtherProjects.includes(otherProjects[random])) {
                continue;
            }
            twoOtherProjects.push(otherProjects[random]);
            i++;
        }
        return { global, currentProject, twoOtherProjects };
    },
    data: () => ({
        imageIsLoaded: false
    }),
    computed: {
        title() {
            return this.$storyapi.richTextResolver.render(this.currentProject.content.song_title);
        }
    },
    watch: {
        imageIsLoaded(loaded) {
            if (loaded && this.imageIsLoaded) this.reveal();
        }
    },
    mounted() {
        if (this.imageIsLoaded) this.reveal();
    },
    methods: {
        reveal() {
            const loading = this.$el.querySelector('.overlay');
            gsap.set(loading, {
                autoAlpha: 0
            });

            this.$store.commit('layout/setOverlay', false);
            this.$store.commit('layout/setHeader', true);
            this.$store.commit('layout/setFooter', true);
            const tl = gsap.timeline();
            const title = this.$el.querySelectorAll('.project-title .word');
            const infos = this.$el.querySelectorAll('.info-item, .project-info .tag');
            const image = this.$refs.bigImage.$el;

            tl.to(
                title,
                {
                    duration: 1.2,
                    ease: 'expo.out',
                    stagger: 0.05,
                    opacity: 1,
                    rotateX: 0
                },
                'title'
            );

            tl.to(
                infos,
                {
                    duration: 0.8,
                    rotateX: 0,
                    opacity: 1,
                    stagger: 0.1,
                    ease: 'power3.out'
                },
                'title+=0.6'
            );
            tl.to(
                image,
                {
                    duration: 1.8,
                    scale: 1,
                    opacity: 1,
                    ease: 'power3.out'
                },
                'title+=0.8'
            );
        }
    },
    head() {
        return {
            ...handleSeo({ route: this.$route.fullPath, data: this.currentProject.content })
        };
    }
};
</script>

<style lang="scss" scoped>
.project-hero {
    padding: 55px 0 45px;
}
.project-hero-details {
    margin-top: 60px;
}
.project-info {
    margin-top: 10px;
    ::v-deep .tag,
    .info-item {
        display: block;
        opacity: 0;
        transform-origin: 50% 50% -6px;
        opacity: 0;
        transform: perspective(1000px) rotateX(80deg);
    }
}
.wrapper-project-title {
    padding-top: 100px;
}
.project-title {
    font-family: $telegraf;
    font-size: 6.5rem;
    line-height: 1;
    font-weight: 100;
    ::v-deep .word {
        display: inline-block;
        transform-origin: 50% 50% -25px;
        opacity: 0;
        transform: perspective(1000px) rotateX(80deg);
    }
}
.info-title {
    display: block;
    font-family: $object;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1;
    margin: 0 0 5px;
    color: $grey-3;
}
.info-content {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 20px;
}

.big-image {
    overflow: hidden;
    ::v-deep picture.fast-image {
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0;
        transform: scale(1.1);
        transition: none;
    }
}

@media (min-width: $tablet) {
    .wrapper-project-title {
        padding-top: 120px;
    }
    .project-hero-details {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: 90px;
    }
    .project-infos {
        width: percentage(4/8);
    }
    .project-info {
        display: flex;
        align-items: baseline;
    }
    .project-title {
        font-size: 9rem;
        line-height: 80px;
    }
    .info-title {
        margin: 0 10px 0 0;
    }
}
@media (min-width: $desktop) {
    .project-infos {
        width: percentage(5/10);
    }
}
@media (min-width: $desktop-xxl) {
    .project-infos {
        width: percentage(6/10);
    }
}
</style>
