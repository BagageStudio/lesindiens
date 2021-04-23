<template>
    <div class="services">
        <div v-for="service in data" :key="service._uid" class="service">
            <div class="container">
                <div class="container-small">
                    <div class="service-content">
                        <div class="service-title-intro">
                            <h3 class="service-title content-pad">{{ service.title }}</h3>
                            <div class="service-intro content-pad" v-html="resolveRichText(service.intro)" />
                        </div>
                        <div class="service-sidebar-projects">
                            <SidebarItems class="content-pad" :data="service.sidebar_items" />
                        </div>
                    </div>
                </div>
            </div>
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
    .service-title-intro {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-top: 45px;
    }
    .service-title {
        width: percentage(2/8);
    }
    .service-intro {
        width: percentage(5/8);
    }
}
@media (min-width: $desktop) {
    .service-title {
        width: percentage(3/10);
    }
    .service-intro {
        width: percentage(6/10);
    }
}
</style>
