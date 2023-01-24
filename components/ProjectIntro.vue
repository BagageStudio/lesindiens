<template>
    <div class="wrapper-project-details">
        <Reveal name="intro" class="container" :offset="{ top: 270, bottom: 250 }" hook>
            <div class="container-details container-small">
                <div class="project-details content-pad">
                    <div v-for="detail in project.content.details" :key="detail._uid" class="project-detail">
                        <span class="project-detail-title project-detail-item">{{ detail.title }}</span>
                        <span class="project-detail-content project-detail-item">{{ detail.content }}</span>
                    </div>
                </div>
                <div class="project-intro content-pad">
                    <div ref="intro" v-html="intro" />
                    <Button
                        v-if="project.content.website_link.url"
                        ref="projectLink"
                        icon
                        class="primary project-link"
                        :link="project.content.website_link.url"
                        target="_blank"
                        rel="noopener nofollow noreferrer"
                    >
                        Voir le site
                    </Button>
                </div>
            </div>
        </Reveal>
    </div>
</template>
<script>
import { gsap } from 'gsap';
import Reveal from '~/components/Reveal';
import Button from '~/components/Button.vue';

export default {
    components: {
        Reveal,
        Button
    },
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        tl: null
    }),
    computed: {
        intro() {
            return this.$storyapi.richTextResolver.render(this.project.content.intro);
        }
    },
    mounted() {
        const items = this.$el.querySelectorAll('.project-detail-item');
        gsap.set(this.$refs.intro, {
            opacity: 0
        });
        gsap.set(items, {
            opacity: 0,
            rotateX: 80
        });
        this.tl = gsap.timeline({ paused: true });
        this.tl.addLabel('start');
        this.tl.to(items, {
            duration: 1,
            rotateX: 0,
            opacity: 1,
            ease: 'expo.out',
            stagger: 0.2
        });
        this.tl.to(
            this.$refs.intro,
            {
                duration: 0.8,
                opacity: 1
            },
            'start+=0.8'
        );
        const projectLink = this.$refs.projectLink;
        if (projectLink) {
            projectLink.hide();
            this.tl.add(() => {
                projectLink.appear();
            }, 'start+=1');
        }
    },
    methods: {
        introIn() {
            this.tl.play();
        }
    }
};
</script>
<style lang="scss" scoped>
.wrapper-project-details {
    padding: 80px 0;
}
.project-detail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 35px;
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 20px;
}
.project-detail-item {
    transform: perspective(500px);
    transform-origin: 50% 50% -10px;
}
.project-detail-title {
    margin-bottom: 10px;
    color: $grey-3;
}
.project-link {
    margin-top: 60px;
}
.project-intro {
    ::v-deep h2 {
        font-size: 2.4rem;
        font-weight: 400;
        margin: 0 0 25px;
    }
    ::v-deep p {
        color: $grey-4;
    }
}

@media (min-width: $phone) {
    .project-intro {
        ::v-deep h2 {
            font-size: 3.5rem;
            line-height: 42px;
            margin-bottom: 60px;
        }
    }
}
@media (min-width: $tablet) {
    .container-details {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
    .project-details {
        width: percentage(2/8);
    }
    .project-detail {
        &:last-child {
            margin-bottom: 0;
        }
    }
    .project-intro {
        width: percentage(5/8);
    }
}
@media (min-width: $desktop-small) {
    .wrapper-project-details {
        padding: 140px 0;
    }
}
@media (min-width: $desktop) {
    .project-details {
        width: percentage(3/10);
    }
}
</style>
