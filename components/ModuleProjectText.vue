<template>
    <div class="module-text" :class="{ 'is-white': data.white_bg }">
        <Reveal name="projectText" class="container" :offset="{ top: 270, bottom: 250 }" hook>
            <div class="container-small">
                <div class="wrapper-text">
                    <div class="module-text-title content-pad">
                        <h3 class="title" v-html="$options.filters.splitInWords(data.title)" />
                    </div>
                    <div ref="content" class="module-text-content content-pad" v-html="richtext" />
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
    data: () => ({ tl: null }),
    computed: {
        richtext() {
            return this.$storyapi.richTextResolver.render(this.data.text);
        }
    },
    watch: {},
    mounted() {
        const letters = this.$el.querySelectorAll('.title .word');

        gsap.set(this.$refs.content, {
            opacity: 0
        });

        gsap.set(letters, {
            opacity: 0,
            rotateX: 80
        });

        this.tl = gsap.timeline({ paused: true }).addLabel('start');

        this.tl.to(
            letters,
            {
                duration: 1.2,
                rotateX: 0,
                opacity: 1,
                ease: 'expo.out',
                stagger: 0.2
            },
            'start'
        );

        this.tl.to(
            this.$refs.content,
            {
                duration: 0.8,
                opacity: 1
            },
            'start+=0.65'
        );
    },
    methods: {
        projectTextIn() {
            this.tl.play();
        }
    }
};
</script>

<style lang="scss" scoped>
.module-text {
    padding: 60px 0;
    ::v-deep p {
        color: $grey-4;
    }
    &.is-white {
        color: $black;
        background: $white;
        ::v-deep p {
            color: $grey-2;
        }
    }
}
.module-text-title {
    margin-bottom: 28px;
}
.title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    ::v-deep .word {
        display: inline-block;
        transform-origin: 50% 50% -20px;
        transform: perspective(500px);
    }
}

@media (min-width: $desktop-small) {
    .module-text {
        padding: 100px 0;
    }
    .wrapper-text {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .module-text-title {
        width: percentage(2/8);
    }
    .module-text-content {
        width: percentage(5/8);
    }
}
@media (min-width: $desktop) {
    .module-text {
        padding: 140px 0;
    }
    .module-text-title {
        width: percentage(3/10);
    }
    .module-text-content {
        width: percentage(6/10);
    }
    .title {
        font-size: 3rem;
        line-height: 36px;
    }
}
@media (min-width: $desktop-large) {
    .title {
        font-size: 3.5rem;
        line-height: 42px;
    }
}
</style>
