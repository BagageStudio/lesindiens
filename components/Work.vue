<template>
    <div class="work">
        <Reveal name="work" class="container" :offset="{ top: 270, bottom: 250 }" hook>
            <div class="container-small">
                <div class="work-content">
                    <hr ref="separator" />
                    <h4 ref="title" class="work-title content-pad" v-html="resolveRichText(data.work_title)" />
                    <div class="wrapper-cols">
                        <div v-if="isL" ref="sidebar">
                            <SidebarItems class="col-small content-pad" :data="data.work_sidebar_items" />
                        </div>
                        <div class="col-large content-pad">
                            <div ref="intro" class="work-intro" v-html="resolveRichText(data.work_intro)" />
                            <div v-if="!isL" ref="sidebar">
                                <SidebarItems :data="data.work_sidebar_items" />
                            </div>
                            <Values :data="data.values" />
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
        gsap.set([this.$refs.title, this.$refs.intro, this.$refs.sidebar, this.$refs.projects], {
            opacity: 0
        });
        gsap.set(this.$refs.separator, {
            scaleX: 0.7,
            opacity: 0
        });

        this.tl = gsap.timeline({ paused: true });
        this.tl.addLabel('start');
        this.tl.to(
            this.$refs.separator,
            {
                duration: 0.3,
                opacity: 1
            },
            'start'
        );
        this.tl.to(
            this.$refs.separator,
            {
                duration: 0.6,
                scaleX: 1
            },
            'start'
        );
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
.work-content {
    position: relative;
    padding: 36px 0 0;
    hr {
        content: '';
        position: absolute;
        top: 0;
        max-width: 100%;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
        background: none;
    }
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
    .work-content {
        padding-top: 45px;
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
        padding: 160px 0;
    }
    .work-content {
        padding-top: 80px;
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
