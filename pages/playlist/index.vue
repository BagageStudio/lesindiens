<template>
    <div class="playlist">
        <div ref="glWrapper" class="gl-wrapper" />
        <div class="content-pgb" :class="{ show: scrolling }">
            <div class="container">
                <div class="container-small">
                    <div class="content-pad">
                        <div class="progress-bar">
                            <div
                                class="progress-bar-inner"
                                :style="{
                                    width: `${projectWidthPercent}%`,
                                    transform: `translateX(${percentage * projects.length}%)`
                                }"
                            />
                            <div
                                class="progress-bar-inner"
                                :style="{
                                    width: `${projectWidthPercent}%`,
                                    transform: `translateX(${extraPercentage}%)`
                                }"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-infos" :class="{ hide: scrolling }">
            <div class="container">
                <div class="container-small">
                    <div class="content-pad">
                        <h1 v-if="currentProject">{{ currentProject.content.song_title }}</h1>
                        <div class="client">
                            <span>Client: </span>
                            <span v-if="currentProject">{{ currentProject.content.name }}</span>
                        </div>
                        <div class="expertises">
                            <span>Expertises: </span>
                            <Tags
                                v-if="currentProject && currentProject.content.expertises"
                                :tags="currentProject.content.expertises"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async asyncData({ app, $config, error }) {
        const home = await app.$storyapi
            .get('cdn/stories/home', {
                version: $config.sBlokVersion
            })
            .then(res => res.data.story.content)
            .catch(res => error({ statusCode: 404, message: 'Failed to receive content form api' }));

        console.log(home);

        const projects = await app.$storyapi
            .get('cdn/stories', {
                version: $config.sBlokVersion,
                by_uuids: home.projects.join(','),
                resolve_relations: 'expertises'
            })
            .then(res => res.data.stories)
            .catch(res => {
                console.error(res);
                error({ statusCode: 404, message: 'Failed to receive content form api' });
            });
        return { projects };
    },
    data() {
        return {
            percentage: 0,
            scrolling: false,
            currentProject: null
        };
    },
    computed: {
        projectWidthPercent() {
            return 100 / this.projects.length;
        },
        extraPercentage() {
            const threshold = 100 - 100 / this.projects.length;
            if (this.percentage > 100 - 100 / this.projects.length) {
                return -100 + (this.percentage - threshold) * this.projects.length;
            } else {
                return -100;
            }
        }
    },
    mounted() {
        const projects = this.projects.map(p => ({
            id: p.id,
            image: p.content.image.filename.replace('a.storyblok', 's3.amazonaws.com/a.storyblok')
        }));

        this.$webgl.init({
            dom: this.$refs.glWrapper
        });

        this.currentProject = this.projects[0];

        this.$webgl.onSelected = this.onSelected;
        this.$webgl.onScrollChange = this.onScrollChange;
        this.$webgl.onScrollStart = this.onScrollStart;
        this.$nextTick(() => {
            this.$webgl.addMedias([...projects, ...projects, ...projects]);
        });
    },
    methods: {
        onScrollStart() {
            this.scrolling = true;
        },
        onSelected(s) {
            this.scrolling = false;
            const projectIndex = s % this.projects.length;
            const project = this.projects[projectIndex];
            this.currentProject = project;
        },
        onScrollChange(progress, widthTotal) {
            const maxScroll = widthTotal / 3;
            const scroll = (progress * 100) / maxScroll;
            const move = scroll % 100;
            this.percentage = move < 0 ? 100 + move : move;
        }
    }
};
</script>

<style lang="scss" scoped>
.playlist {
    position: relative;
    height: 100vh;
    width: 100vw;
}
.gl-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.content-pgb {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 10vh;
    opacity: 0;
    transition: 0.4s ease-in-out 0.5s;
    &.show {
        opacity: 1;
        transition: 0.2s ease-in-out 0.2s;
    }
}

.content-infos {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 70px;
    opacity: 1;
    transition: 0.4s ease-in-out 0.7s;
    &.hide {
        opacity: 0;
        transition: 0.2s ease-in-out;
    }
}
.progress-bar {
    position: relative;
    width: 100%;
    height: 1px;
    background-color: #666262;
    overflow: hidden;
    &-inner {
        position: absolute;
        top: -1px;
        left: 0;
        height: 3px;
        background-color: #fff;
        transform-origin: 0% 50%;
    }
}
</style>
