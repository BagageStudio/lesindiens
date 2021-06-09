<template>
    <div class="playlist">
        <div ref="glWrapper" class="gl-wrapper" />
        <div
            ref="sizeElement"
            class="canvas-size"
            :class="{ 'no-cursor': cursorIsShown && !scrolling }"
            @mouseleave="hideCursor"
        />
        <div class="content-infos">
            <div class="container">
                <div class="container-small">
                    <div class="content-pad infos" :class="{ hide: scrolling }">
                        <h1 v-if="currentProject">
                            <div class="title" v-html="projectTitle" />
                        </h1>
                        <div class="client detail">
                            <span class="label detail-inner">Client</span>
                            <span v-if="currentProject" class="info detail-inner">{{
                                currentProject.content.name
                            }}</span>
                        </div>
                        <div class="expertises detail">
                            <span class="label detail-inner">Expertises</span>
                            <Tags
                                v-if="currentProject && currentProject.content.expertises"
                                class="info detail-inner"
                                :tags="currentProject.content.expertises"
                            />
                        </div>
                    </div>
                    <div class="progress-bar-container content-pad" :class="{ show: scrolling }">
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
    </div>
</template>

<script>
export default {
    async asyncData({ app, $config, error }) {
        const playlist = await app.$storyapi
            .get('cdn/stories/playlist', {
                version: $config.sBlokVersion
            })
            .then(res => res.data.story.content)
            .catch(res => error({ statusCode: 404, message: 'Failed to receive content form api' }));

        const projects = await app.$storyapi
            .get('cdn/stories', {
                version: $config.sBlokVersion,
                by_uuids: playlist.projects.join(','),
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
            currentProject: null,
            cursorIsShown: false
        };
    },
    computed: {
        cursorIcon() {
            return this.$store.state.cursor.icon;
        },
        projectTitle() {
            if (!this.currentProject) return '';
            return typeof this.currentProject.content.song_title === 'string'
                ? this.currentProject.content.song_title
                : this.$storyapi.richTextResolver.render(this.currentProject.content.song_title);
        },
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
        if (!this.$webgl.dom) {
            this.initializeSlider();
        } else {
            this.setCallbackMethods();

            this.$webgl.enable({
                dom: this.$refs.glWrapper,
                sizeElement: this.$refs.sizeElement
            });
        }
    },
    beforeDestroy() {
        this.hideCursor();
        this.$webgl.disable();
    },
    methods: {
        setCallbackMethods() {
            this.$webgl.onSelected = this.onSelected.bind(this);
            this.$webgl.onScrollChange = this.onScrollChange.bind(this);
            this.$webgl.onScrollStart = this.onScrollStart.bind(this);
            this.$webgl.showCursor = this.showCursor.bind(this);
            this.$webgl.hideCursor = this.hideCursor.bind(this);
            this.$webgl.goToProject = this.goToProject.bind(this);
        },
        initializeSlider() {
            const projects = this.projects.map(p => ({
                id: p.id,
                image: p.content.thumbnail.filename.replace('a.storyblok', 's3.amazonaws.com/a.storyblok')
            }));

            this.$webgl.init({
                dom: this.$refs.glWrapper,
                sizeElement: this.$refs.sizeElement
            });

            this.currentProject = this.projects[0];

            this.setCallbackMethods();

            this.$nextTick(() => {
                this.$webgl.addMedias([...projects, ...projects, ...projects]);
            });
        },
        goToProject(projectSelected) {
            const project = this.projects.find(p => projectSelected.id === p.id);
            this.$router.push(`/${project.full_slug}`);
        },
        showCursor() {
            this.$store.commit('cursor/setIcon', 'eye');
            this.$store.commit('cursor/setShowCursor', true);
            this.cursorIsShown = true;
        },
        hideCursor() {
            this.$store.commit('cursor/setShowCursor', false);
            this.cursorIsShown = false;
        },
        onScrollStart() {
            this.scrolling = true;
            this.hideCursor();
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    padding-top: 116px;
}

.canvas-size-wrapper {
    width: 100%;
    min-height: 0;
}
.canvas-size {
    display: flex;
    width: 100%;
    cursor: grab;
    flex: 1 0 auto;
    margin: 50px 0;
    &.no-cursor {
        cursor: none;
    }
}

.gl-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.content-infos {
    flex: 0 0 150px;
    height: 150px;
    margin-bottom: 30px;
    transition: 0.4s ease-in-out 0.7s;
    h1 {
        display: inline-block;
        font-family: $telegraf;
        font-weight: 100;
        font-size: 4.2rem;
        line-height: 45px;
        margin-bottom: 30px;
        perspective: 1000px;
        perspective-origin: 50% 50%;

        // transition: 0.4s ease-in-out 0.7s;
    }
}

.infos {
    &.hide {
        .detail-inner {
            opacity: 0;
            transform: translateY(10px);
            transition: 0.2s ease-in-out;
        }
        .title {
            opacity: 0;
            transform: rotateX(45deg);
            transition: 0.2s ease-in-out;
        }
    }
}

.container-small {
    position: relative;
}

.title {
    transform: rotateX(0);
    transform-origin: 50% 100% -20px;
    transition: 0.4s ease-in-out 0.7s;
    ::v-deep br {
        display: none;
    }
}

.detail {
    display: flex;
    align-items: baseline;
}

.detail-inner {
    opacity: 1;
    transform: translateY(0px);
    transition: 0.4s ease-out 0.7s;
}

.client {
    font-size: 1.3rem;
    margin-bottom: 10px;
    .info {
        transition-delay: 0.75s;
    }
}

.expertises {
    .label {
        transition-delay: 0.8s;
    }
    .info {
        transition-delay: 0.85s;
    }
}

.label {
    font-size: 1.3rem;
    color: $grey-3;
    margin-right: 10px;
}

.progress-bar-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: 0.4s ease-in-out 0.5s;
    &.show {
        opacity: 1;
        transition: 0.2s ease-in-out 0.2s;
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
