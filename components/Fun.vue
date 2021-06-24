<template>
    <div class="fun">
        <div class="container">
            <div class="container-small">
                <div class="wrapper-cols">
                    <div class="col-large content-pad">
                        <h4 v-if="!isL" class="fun-title">{{ data.fun_title }}</h4>
                        <div class="fun-intro" v-html="resolveRichText(data.fun_intro)" />
                    </div>
                    <div class="col-small content-pad">
                        <SidebarItems class="fun-sidebar" :data="data.fun_sidebar_items" />
                    </div>
                </div>
            </div>
        </div>
        <div ref="sizeElement" class="size-element">
            <div class="container big-title-container">
                <p class="big-title">{{ data.fun_title }}</p>
            </div>
        </div>
        <div ref="webgl" class="fun-gl" />
    </div>
</template>

<script>
import { FunGL } from '~/assets/js/webgl/Fun/index';
export default {
    props: {
        data: { type: Object, required: true }
    },
    computed: {
        isL() {
            if (!this.$store.state.superWindow) return true;
            return this.$store.state.superWindow.width >= this.$breakpoints.list.l;
        }
    },
    watch: {},
    mounted() {
        this.funGL = FunGL;
        const images = this.data.fun_photos.map(p => ({
            id: p.id,
            image: p.filename.replace('a.storyblok', 's3.amazonaws.com/a.storyblok')
        }));
        this.funGL.init({ dom: this.$refs.webgl, sizeElement: this.$refs.sizeElement, images });
    },
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        }
    }
};
</script>

<style lang="scss" scoped>
.fun {
    position: relative;
    padding: 60px 0 0;
}
.fun-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    margin-bottom: 28px;
}
.fun-intro {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 30px;
    margin-bottom: 30px;
}
.fun-sidebar {
    margin-top: 50px;
}
.fun-gl {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
}
.big-title {
    display: none;
}
.size-element {
    width: 100%;
    height: 1000px;
    //to go just at the line of the footer
    margin-bottom: -199px;
}
@media (min-width: $desktop-small) {
    .size-element {
        padding-top: 115px;
    }
    .big-title {
        display: block;
        font-family: $telegraf;
        font-weight: 100;
        text-align: center;
        font-size: 12rem;
        line-height: 80px;
        user-select: none;
        pointer-events: none;
    }
    .fun {
        padding: 100px 0 0;
    }
    .fun-sidebar {
        margin-top: 0;
    }
}
@media (min-width: $desktop) {
    .fun {
        padding: 160px 0 0;
    }
    .size-element {
        height: 1060px;
        //to go just at the line of the footer
        margin-bottom: -258px;
    }
}
</style>
