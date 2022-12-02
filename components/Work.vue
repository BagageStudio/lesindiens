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
                            <div class="values">
                                <div v-for="value in data.values" :key="value._uid" class="value">
                                    <hr ref="valueSeparator" />
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
        gsap.set([this.$refs.separator, this.$refs.valueSeparator], {
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
        this.tl.to(
            this.$refs.valueSeparator,
            {
                duration: 0.3,
                stagger: 0.1,
                delay: 0.4,
                opacity: 1
            },
            'start'
        );
        this.tl.to(
            this.$refs.valueSeparator,
            {
                duration: 0.6,
                stagger: 0.3,
                delay: 0.4,
                scaleX: 1
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
.work-content {
    position: relative;
    padding: 36px 0 0;
    > hr {
        position: absolute;
        top: 0;
    }
    hr {
        max-width: 100%;
        left: $gutter;
        right: $gutter;
        margin: 0;
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
.values {
    margin-top: 40px;
}
.value {
    margin-bottom: 80px;
    > hr {
        margin-bottom: 33px;
        border-top: 1px solid $white;
    }
    &:last-child {
        margin-bottom: 0;
    }
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
        margin: 0 #{$gutter} 80px;
        &:nth-last-child(-n + 2) {
            margin-bottom: 0;
        }
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
