<template>
    <div>
        <div class="project-hero">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-project-title">
                        <h1 class="project-title content-pad" v-html="title" />
                    </div>
                    <div class="project-hero-details">
                        <div class="project-infos content-pad">
                            <div class="project-info">
                                <span class="info-title">Client</span>
                                <span class="info-content">{{ currentProject.content.name }}</span>
                            </div>
                            <div class="project-info">
                                <span class="info-title">Expertise</span>
                                <Tags :tags="currentProject.content.expertises" />
                            </div>
                        </div>
                        <div class="project-song" />
                    </div>
                </div>
            </div>
        </div>
        <FastImage :image="currentProject.content.image" full-width />
        <div class="wrapper-project-details">
            <div class="container">
                <div class="container-details container-small">
                    <div class="project-details content-pad">
                        <div v-for="detail in currentProject.content.details" :key="detail._uid" class="project-detail">
                            <span class="project-detail-title">{{ detail.title }}</span>
                            <span class="project-detail-content">{{ detail.content }}</span>
                        </div>
                    </div>
                    <div class="project-intro content-pad">
                        <div v-html="intro" />
                        <Button
                            v-if="currentProject.content.website_link.url"
                            icon
                            class="primary project-link"
                            :link="currentProject.content.website_link.url"
                            target="_blank"
                            rel="noopener nofollow noreferrer"
                        >
                            Voir le site
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <component
            :is="module.component"
            v-for="module in currentProject.content.modules"
            :key="module.id"
            :data="module"
        />
        <LinkedProjects :projects="twoOtherProjects" />
        <div class="container">
            <div class="container-small">
                <div class="wrapper-footer content-pad">
                    <Footer theme="light" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ app, $config, error, route }) {
        const projects = await app.$storyapi
            .get('cdn/stories', {
                starts_with: 'playlist/',
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
        const otherProjects = projects.filter(element => element.slug !== route.params.uid);
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
        return { currentProject, twoOtherProjects };
    },
    computed: {
        title() {
            return this.$storyapi.richTextResolver.render(this.currentProject.content.song_title);
        },
        intro() {
            return this.$storyapi.richTextResolver.render(this.currentProject.content.intro);
        }
    }
};
</script>

<style lang="scss" scoped>
.project-hero {
    padding: 110px 0 20px;
}
.project-hero-details {
    margin-top: 30px;
}
.project-info {
    margin-top: 10px;
}
.project-title {
    font-family: $telegraf;
    font-size: 6.5rem;
    line-height: 1;
    font-weight: 100;
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
.project-song {
    margin-top: 115px;
}

.wrapper-project-details {
    padding: 80px 0;
}
.project-detail {
    display: flex;
    flex-direction: column;
    margin-bottom: 35px;
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 20px;
}
.project-detail-title {
    margin-bottom: 10px;
    color: $grey-3;
}
.project-link {
    margin-top: 60px;
}

@media (min-width: $tablet) {
    .wrapper-project-title {
        min-height: 472px;
        padding-top: 75px;
    }
    .project-hero-details {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
    }
    .project-infos {
        width: percentage(7/10);
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
    .project-song {
        margin-top: 0;
        width: percentage(2/10);
    }

    .container-details {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .project-details {
        width: percentage(2/8);
    }
    .project-detail {
        &:last-child {
            margin-bottom: 0;
        }
    }
    .project-intro {
        width: percentage(5/8);
    }
}
@media (min-width: $desktop-small) {
    .wrapper-project-details {
        padding: 150px 0;
    }
}
@media (min-width: $desktop) {
    .wrapper-project-details {
        padding: 240px 0;
    }
    .project-details {
        width: percentage(3/10);
    }
    .project-intro {
        width: percentage(6/10);
    }
}
</style>
