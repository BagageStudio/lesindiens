<template>
    <div class="playlist">
        <div ref="glWrapper" class="gl-wrapper" />
        <div class="content">
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
    </div>
</template>

<script>
export default {
    asyncData({ app, $config, error }) {
        return app.$storyapi
            .get('cdn/stories/home', {
                version: $config.sBlokVersion,
                resolve_relations: 'home.projects'
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
    },
    data: () => ({
        percentage: 0
    }),
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

        this.$webgl.onSelected = this.onSelected;
        this.$webgl.onScrollChange = this.onScrollChange;
        this.$nextTick(() => {
            this.$webgl.addMedias([...projects, ...projects, ...projects]);
        });
    },
    methods: {
        onSelected(s) {
            const projectIndex = s % this.projects.length;
            const project = this.projects[projectIndex];
            console.log(project);
        },
        onScrollChange(progress, widthTotal) {
            const maxScroll = widthTotal / 3;
            const scroll = (progress * 100) / maxScroll;
            this.percentage = scroll % 100;
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
.content {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 10vh;
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
