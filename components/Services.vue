<template>
    <div class="services">
        <div v-for="service in data" :key="service._uid" class="service">
            <Reveal name="service" class="container">
                <div class="container-small">
                    <div class="service-content">
                        <div class="wrapper-cols service-title-intro">
                            <h3 class="service-title col-small content-pad to-anim">{{ service.title }}</h3>
                            <div
                                class="service-intro col-large content-pad to-anim"
                                v-html="resolveRichText(service.intro)"
                            />
                        </div>
                        <div class="wrapper-cols service-sidebar-projects">
                            <SidebarItems
                                class="service-sidebar col-small content-pad to-anim"
                                :data="service.sidebar_items"
                            />
                            <div class="col-large content-pad to-anim">
                                <Projects :data="service.projects" />
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Array, required: true }
    },
    data: () => ({}),
    watch: {},
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
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
.service-out {
    .to-anim {
        opacity: 0;
        transform: scale(0.99);
    }
    .service-content {
        &::before {
            opacity: 0;
            transform: scaleX(0.7);
        }
    }
}
.service-in {
    .to-anim {
        opacity: 1;
        transform: scale(1);
        transition: 0.3s ease-out;
        &.service-intro {
            transition-delay: 0.1s;
        }
        &.service-sidebar {
            transition-delay: 0.2s;
        }
    }
    .service-content {
        &::before {
            transition: transform 0.3s ease-out, opacity 0.1s ease-out;
            opacity: 1;
            transform: scaleX(1);
        }
    }
}
.service-content {
    position: relative;
    padding-top: 36px;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
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
