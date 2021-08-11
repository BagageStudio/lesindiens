<template>
    <div class="module-numbered-list">
        <Reveal name="numbered" class="container" :offset="{ top: 270, bottom: 250 }" hook>
            <div class="container-small">
                <div class="wrapper-numered-list">
                    <div class="wrapper-cols">
                        <div class="col-small content-pad">
                            <div
                                ref="numberedTitle"
                                class="numbered-list-title"
                                v-html="$options.filters.splitInWords(data.title)"
                            />
                        </div>
                        <div ref="numberedContent" class="col-large content-pad">
                            <div v-html="resolveRichText(data.content)" />
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
        tl: null
    }),
    computed: {},
    watch: {},
    mounted() {
        const letters = this.$refs.numberedTitle.querySelectorAll('.word');

        gsap.set(this.$refs.numberedContent, {
            opacity: 0
        });
        gsap.set(letters, {
            rotateX: 80,
            opacity: 0
        });

        this.tl = gsap.timeline({ paused: true });
        this.tl.addLabel('start');

        this.tl
            .to(letters, {
                duration: 1.2,
                rotateX: 0,
                opacity: 1,
                ease: 'expo.out',
                stagger: 0.2
            })
            .to(
                this.$refs.numberedContent,
                {
                    duration: 0.8,
                    opacity: 1
                },
                'start+=0.5'
            );
    },
    methods: {
        resolveRichText(text) {
            return this.$storyapi.richTextResolver.render(text);
        },
        numberedIn() {
            this.tl.play();
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper-numered-list {
    position: relative;
    margin: 40px 0 0;
    padding: 30px 0 50px;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $gutter;
        right: $gutter;
        border-top: 1px solid $grey-5;
    }
}
.numbered-list-title {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 32px;
    perspective: 5000px;
    ::v-deep .word {
        display: inline-block;
        transform-origin: 50% 50% -20px;
    }
}

@media (min-width: $desktop-small) {
    .wrapper-numered-list {
        margin-top: 75px;
        padding: 75px 0 105px;
        ::v-deep ol {
            counter-reset: ol-counter;
            > li {
                padding-left: 0;
                &::before {
                    left: calc(-30px - #{2 * $gutter});
                    width: 30px;
                    text-align: right;
                }
            }
        }
    }
}
@media (min-width: $desktop) {
    .wrapper-numered-list {
        padding: 115px 0 160px;
    }
    .numbered-list-title {
        font-size: 3.5rem;
        line-height: 42px;
    }
}
</style>
