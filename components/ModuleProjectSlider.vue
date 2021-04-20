<template>
    <div class="module-slider">
        <div class="container">
            <div class="wrapper-slider">
                <ul class="slider">
                    <li v-for="slide in data.images" :key="slide.id">
                        <FastImage :image="slide" />
                    </li>
                </ul>
                <ul class="slider copy">
                    <li v-for="slide in data.images" :key="slide.id">
                        <FastImage :image="slide" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: Object, required: true }
    },
    data: () => ({}),
    computed: {},
    watch: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.module-slider {
    overflow: hidden;
    padding: 60px 0;
}
.wrapper-slider {
    position: relative;
}
.slider {
    display: flex;
    justify-content: flex-start;
    margin: 0;
    > li {
        flex: 0 0 auto;
        width: 100%;
        margin-right: percentage(1/4);
        padding: 0 #{$gutter};
    }
    &.copy {
        position: absolute;
        top: 0;
        right: 0;
        // transform: translate3d(-100%, 0, 0);
    }
}

@media (min-width: $tablet) {
    .wrapper-slider {
        width: percentage(6/8);
        margin: 0 auto;
    }
    .slider {
        > li {
            margin-right: percentage(1/6);
        }
    }
}
@media (min-width: $desktop-small) {
    .module-slider {
        padding: 100px 0;
    }
}
@media (min-width: $desktop) {
    .module-slider {
        padding: 160px 0;
    }
    .wrapper-slider {
        width: percentage(8/12);
    }
    .slider {
        > li {
            margin-right: percentage(1/8);
        }
    }
}
</style>
