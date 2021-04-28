<template>
    <div class="header">
        <div class="container">
            <div class="container-small">
                <nuxt-link class="content-pad" to="/">
                    <Logo />
                </nuxt-link>
                <div v-if="isMobile" class="content-pad">
                    <button class="burger" aria-label="Menu" @click="toggleMenuMobile">
                        <div class="burger-inner lines" :class="{ show: !showMenuMobile }">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div class="burger-inner cross" :class="{ show: showMenuMobile }">
                            <span />
                            <span />
                            <span />
                        </div>
                    </button>
                </div>

                <transition name="menu" :duration="{ enter: 900, leave: 600 }">
                    <div v-if="isMobile" v-show="showMenuMobile" class="menu">
                        <div class="menu-inner">
                            <div
                                v-for="(link, index) in content.header_links"
                                :key="link._uid"
                                class="content-pad menu-item menu-link"
                            >
                                <nuxt-link :to="'/' + link.link.story.full_slug">
                                    <span>
                                        {{ link.label }}
                                    </span>
                                    <span v-if="index === 0" class="number">{{ numberProjects }}</span></nuxt-link
                                >
                            </div>
                            <div class="content-pad menu-item">
                                <Button icon class="primary email-link" :link="`mailto:${content.email.email}`">
                                    {{ content.email.email }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </transition>

                <div v-if="!isMobile" class="menu-desktop content-pad">
                    <div v-for="(link, index) in content.header_links" :key="link._uid">
                        <nuxt-link :to="'/' + link.link.story.full_slug" class="desktop-link">
                            <span>
                                {{ link.label }}
                            </span>
                            <span v-if="index === 0" class="number">{{ numberProjects }}</span></nuxt-link
                        >
                    </div>
                </div>
                <div v-if="!isMobile" class="content-pad">
                    <Button icon class="primary desktop-email-link" :link="`mailto:${content.email.email}`">
                        {{ content.email.email }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
export default {
    async fetch() {
        const header = await this.$storyapi
            .get('cdn/stories/header', {
                version: this.$config.sBlokVersion,
                resolve_links: 'url'
            })
            .then(res => res.data.story.content)
            .catch(res => this.error({ statusCode: 404, message: 'Failed to receive content form api' }));

        const projects = await this.$storyapi
            .get('cdn/stories/playlist', {
                version: this.$config.sBlokVersion
            })
            .then(res => res.data.story.content.projects)
            .catch(res => this.error({ statusCode: 404, message: 'Failed to receive content form api' }));

        this.numberProjects = projects.length;

        this.content = header;
    },
    data() {
        return {
            content: {},
            numberProjects: 0,
            showMenuMobile: false
        };
    },
    computed: {
        isMobile() {
            return this.ww <= this.$breakpoints.list.l;
        },
        ww() {
            return this.$store.state.superWindow ? this.$store.state.superWindow.width : 320;
        }
    },
    watch: {
        $route(r) {
            if (this.isMobile && this.showMenuMobile) {
                this.toggleMenuMobile();
            }
        },
        ww() {
            if (this.isMobile && this.showMenuMobile) {
                this.toggleMenuMobile();
            }
        }
    },
    methods: {
        async toggleMenuMobile() {
            if (this.$store.state.scroll.scrollTop > 0) await gsap.to(window, { duration: 0.1, scrollTo: 0 });
            this.showMenuMobile = !this.showMenuMobile;
            if (this.showMenuMobile) {
                document.documentElement.classList.add('no-scroll');
            } else {
                document.documentElement.classList.remove('no-scroll');
            }
        }
    }
};
</script>
<style scoped lang="scss">
.header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 116px;
    z-index: 10;
}

.container,
.container-small {
    height: 100%;
}

.container-small {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.logo {
    height: 20px;
    width: 131px;
}

.burger {
    position: relative;
    border: 0;
    width: 25px;
    height: 28px;
}

.burger-inner {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    perspective: 1000px;
    perspective-origin: 50% 50%;
    span {
        position: absolute;
        display: inline-block;
        height: 1px;
        background-color: $white;
        transform-origin: 100% 50% -10px;
        opacity: 0;
        &:nth-child(1) {
            transition-delay: 0s;
        }
        &:nth-child(2) {
            transition-delay: 0.1s;
        }
        &:nth-child(3) {
            transition-delay: 0.2s;
        }
    }
    &.show {
        span {
            opacity: 1;
            &:nth-child(1) {
                transition-delay: 0.2s;
            }
            &:nth-child(2) {
                transition-delay: 0.3s;
            }
            &:nth-child(3) {
                transition-delay: 0.4s;
            }
        }
    }
}

.lines {
    span {
        top: 9px;
        left: 0;
        width: 25px;
        transform: rotateY(-45deg);
        transition: 0.3s ease-in-out;
        &:nth-child(2) {
            top: calc(50% + 4.5px);
            transition-delay: 0.1s;
        }
        &:nth-child(3) {
            top: auto;
            bottom: 0;
            transition-delay: 0.2s;
        }
    }
    &.show {
        span {
            transform: rotateY(0);
        }
    }
}

.cross {
    span {
        top: 0;
        left: -3px;
        width: 25px;
        transform: rotateZ(-45deg) rotateY(45deg);
        transition: 0.3s ease-in-out;
        &:nth-child(2) {
            top: 18px;
            transform: rotateZ(45deg) rotateY(45deg);
        }
        &:nth-child(3) {
            top: auto;
            left: 0;
            bottom: 0;
            transform: rotateZ(0) rotateY(45deg);
        }
    }
    &.show span {
        &:nth-child(1) {
            transform: rotateZ(-45deg) rotateY(0);
        }
        &:nth-child(2) {
            transform: rotateZ(45deg) rotateY(0);
        }
        &:nth-child(3) {
            transform: rotateY(0);
        }
    }
}

.menu {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 100%;
    z-index: -1;
    &::after {
        content: '';
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $black;
        z-index: -1;
        transform-origin: 50% 0%;
    }
}

.menu-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 20px;
    perspective: 500px;
    z-index: 1;
}

.menu-item {
    margin: 25px 0;
    transform-origin: 50% 50% -30px;
}

.menu-link {
    font-family: $telegraf;
    font-size: 3.5rem;
    > a {
        text-decoration: none;
        display: flex;
        align-items: center;
    }
}

.email-link {
    font-size: 2rem;
    padding: 20px 17px 16px;
    ::v-deep {
        .icon {
            width: 21px;
            height: 14px;
        }
        .text {
            line-height: 1.5;
            margin-right: 60px;
        }
    }
}
.number {
    color: #9e9e9e;
    font-size: 2rem;
}

.menu-enter,
.menu-leave-to {
    &::after {
        opacity: 0;
    }
    .menu-item {
        opacity: 0;
        transform: rotateX(45deg);
    }
}

//Open anim
.menu-enter-active {
    &::after {
        transition: 0.8s ease-in-out;
    }
    .menu-item {
        &:nth-child(1) {
            transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.4s,
                transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.4s;
        }
        &:nth-child(2) {
            transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.45s,
                transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.45s;
        }
        &:nth-child(3) {
            transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.5s,
                transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.5s;
        }
    }
}

//Close anim
.menu-leave-active {
    &::after {
        transition: 0.6s ease-in-out 0.1s;
    }
    .menu-item {
        &:nth-child(1) {
            transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1) 0.1s,
                transform 0.3s cubic-bezier(0.25, 1, 0.5, 1) 0.1s;
        }
        &:nth-child(2) {
            transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1) 0.05s,
                transform 0.3s cubic-bezier(0.25, 1, 0.5, 1) 0.05s;
        }
        &:nth-child(3) {
            transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
    }
}

@media (min-width: $desktop-small) {
    .menu-desktop {
        display: flex;
        align-items: center;
    }
    .desktop-link {
        display: flex;
        font-size: 1.6rem;
        font-family: $telegraf;
        margin: 0 25px;
        text-decoration: none;
        .number {
            font-size: 1.2rem;
            margin-top: 2px;
        }
    }
}
</style>
