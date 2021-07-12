<template>
    <div class="service">
        <Reveal name="service" class="container" :offset="{ top: 270, bottom: 250 }" hook>
            <div class="container-small">
                <div class="service-content">
                    <hr ref="separator" />
                    <div class="wrapper-cols service-title-intro">
                        <h3 ref="title" class="service-title col-small content-pad to-anim">{{ data.title }}</h3>
                        <div
                            ref="intro"
                            class="service-intro col-large content-pad to-anim"
                            v-html="resolveRichText(data.intro)"
                        />
                    </div>
                    <div class="wrapper-cols service-sidebar-projects">
                        <div ref="sidebar" class="service-sidebar col-small content-pad to-anim">
                            <SidebarItems :data="data.sidebar_items" />
                        </div>
                        <div ref="projects" class="col-large content-pad to-anim">
                            <Projects :data="data.projects" />
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
    data: () => ({
        title: null,
        tl: null
    }),
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
        serviceIn() {
            this.tl.play();
        }
    }
};
</script>

<style lang="scss" scoped>
.service {
    padding: 60px 0;
    color: $black;
    &:nth-child(odd) {
        background: $white;
    }
    &:nth-child(even) {
        background: $grey-7;
    }
}
.service-content {
    position: relative;
    padding-top: 36px;
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
.service-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin-bottom: 28px;
}

.service-sidebar-projects {
    margin-top: 30px;
}

@media (min-width: $desktop-small) {
    .service {
        padding: 100px 0;
    }
    .service-title-intro {
        padding-top: 45px;
    }
}
@media (min-width: $desktop) {
    .service {
        padding: 160px 0;
    }
    .service-content {
        padding-top: 80px;
    }
    .service-title {
        font-size: 3.5rem;
        line-height: 42px;
    }
}
</style>
