<template>
    <div class="work">
        <Reveal name="work" class="container" :offset="{ top: 270, bottom: 250 }" hook>
            <div class="container-small">
                <div class="work-content">
                    <h4 ref="title" class="work-title content-pad" v-html="resolveRichText(data.work_title)" />
                    <div class="wrapper-cols">
                        <div v-if="isL" ref="sidebar" class="col-small content-pad">
                            <SidebarItems :data="data.work_sidebar_items" />
                        </div>
                        <div class="col-large content-pad">
                            <div ref="intro" class="work-intro" v-html="resolveRichText(data.work_intro)" />
                            <div v-if="!isL" ref="sidebar">
                                <SidebarItems :data="data.work_sidebar_items" />
                            </div>
                            <div class="values">
                                <div v-for="value in data.values" :key="value._uid" class="value">
                                    <div ref="valueContent" class="value-content">
                                        <FastImage class="value-icon" :image="value.icon" />
                                        <div class="value-title">{{ value.title }}</div>
                                        <p class="value-content">{{ value.description }}</p>
                                    </div>
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
    watch: {},
    mounted() {
        gsap.set(
            [this.$refs.title, this.$refs.intro, this.$refs.sidebar, this.$refs.projects, this.$refs.valueContent],
            {
                opacity: 0
            }
        );

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
            this.$refs.sidebar,
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
        this.tl.to(
            this.$refs.valueContent,
            {
                duration: 0.8,
                stagger: 0.3,
                delay: 0.5,
                opacity: 1
            },
            'start'
        );
    },
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        },
        workIn() {
            this.tl.play();
        }
    }
};
</script>

<style lang="scss" scoped>
.work {
    padding: 60px 0 100px;
}
.work-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 3.5rem;
    line-height: 42px;
    margin-bottom: 28px;
}
.work-intro {
    font-family: $object;
    font-weight: 400;
    font-size: 2rem;
    line-height: 30px;
    margin-bottom: 30px;
}
.value {
    margin-top: 80px;
}
.value-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin: 30px 0 20px;
    margin-bottom: 20px;
}
.value-content {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 30px;
}

@media (min-width: $phone) {
    .values {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + #{2 * $gutter});
        margin-left: -#{$gutter};
    }
    .value {
        width: calc(50% - #{2 * $gutter});
        margin: 80px #{$gutter} 0;
    }
}
@media (min-width: $tablet) {
    .work-title {
        font-size: 6rem;
        line-height: 60px;
    }
}
@media (min-width: $desktop-small) {
    .work {
        padding: 100px 0;
    }
    .work-title {
        font-size: 8rem;
        line-height: 80px;
        margin-bottom: 40px;
    }
    .work-intro {
        margin-bottom: 0;
    }
}
@media (min-width: $desktop) {
    .work {
        padding: 140px 0;
    }
}
@media (min-width: $desktop-xxl) {
    .work-title {
        font-size: 12rem;
        line-height: 120px;
        margin-bottom: 80px;
    }
}
</style>
