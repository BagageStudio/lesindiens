<template>
    <div>
        <div class="project-hero">
            <div class="container">
                <div class="container-small">
                    <div class="wrapper-project-title">
                        <h1 class="project-title content-pad">{{ story.content.song_title }}</h1>
                    </div>
                    <div class="project-details">
                        <div class="project-infos content-pad">
                            <div class="project-info">
                                <span class="info-title">Client</span>
                                <span class="info-content">{{ story.content.name }}</span>
                            </div>
                            <div class="project-info">
                                <span class="info-title">Expertise</span>
                                <Tags :tags="story.content.expertises" />
                            </div>
                        </div>
                        <div class="project-song" />
                    </div>
                </div>
            </div>
        </div>
        <component :is="module.component" v-for="module in story.content.modules" :key="module.id" :data="module" />
    </div>
</template>

<script>
export default {
    asyncData({ app, $config, error, route }) {
        return app.$storyapi
            .get(`cdn/stories/playlist/${route.params.uid}`, {
                version: $config.sBlokVersion,
                resolve_relations: 'expertises'
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

<style lang="scss" scoped>
.project-hero {
    padding: 110px 0 20px;
}
.project-details {
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
    font-family: $graphik;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1;
    margin: 0 0 5px;
    color: $grey-3;
}
.info-content {
    font-family: $graphik;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 20px;
}
.project-song {
    margin-top: 115px;
}

@media (min-width: $tablet) {
    .wrapper-project-title {
        min-height: 472px;
        padding-top: 75px;
    }
    .project-details {
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
}
</style>
