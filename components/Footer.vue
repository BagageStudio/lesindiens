<template>
    <footer class="footer" :class="{ 'ultra-light': theme === 'ultra-light' }">
        <div v-if="theme !== 'ultra-light' && theme !== 'light'" class="wrapper-contact">
            <div class="contact-links">
                <a
                    v-for="contactLink in content.contact_links"
                    :key="contactLink._uid"
                    :href="contactLink.link.url"
                    class="contact-link"
                >
                    {{ contactLink.label }}
                </a>
            </div>
            <div class="footer-address">
                <span class="address-label">Siège social</span>
                <span class="address-content">{{ content.address }}</span>
            </div>
        </div>
        <div class="wrapper-links">
            <div v-if="theme !== 'ultra-light'" class="social-links">
                <a
                    v-for="socialLink in content.social_links"
                    :key="socialLink._uid"
                    :href="socialLink.link.url"
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                    class="social-link"
                >
                    {{ socialLink.label }}
                </a>
            </div>
            <div class="wrapper-copy-links">
                <span class="copy">{{ content.copy }}</span>
                <div class="footer-links">
                    <nuxt-link
                        v-for="footerLink in content.footer_links"
                        :key="footerLink.id"
                        :to="'/' + footerLink.link.story.full_slug"
                        class="footer-link"
                        >{{ footerLink.label }}</nuxt-link
                    >
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import { gsap } from 'gsap';

export default {
    props: {
        theme: { type: String, default: '' }
    },
    async fetch() {
        const footer = await this.$storyapi
            .get('cdn/stories/footer', {
                version: this.$config.sBlokVersion,
                resolve_links: 'url'
            })
            .then(res => res.data.story.content)
            .catch(res => this.error({ statusCode: 404, message: 'Failed to receive content form api' }));

        this.content = footer;
    },
    data() {
        return {
            content: {}
        };
    },
    computed: {
        show() {
            return this.$store.state.layout.showHeader;
        }
    },
    watch: {
        show(show) {
            if (show) {
                gsap.to(this.$el, {
                    duration: 1,
                    opacity: 1
                });
            } else {
                gsap.set(this.$el, {
                    opacity: 0
                });
            }
        }
    },
    mounted() {
        if (this.show) {
            gsap.to(this.$el, {
                duration: 1,
                opacity: 1
            });
        }
    }
};
</script>
<style scoped lang="scss">
.footer {
    opacity: 0;
    padding: 38px 0;
}
.wrapper-contact {
    position: relative;
    margin-bottom: 50px;
    padding-bottom: 40px;
    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid $grey-2;
    }
}
.contact-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 50px;
}
.contact-link {
    font-family: $telegraf;
    font-weight: 400;
    font-size: 3.5rem;
    line-height: 42px;
    margin-top: 15px;
}
.footer-address {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 20px;
}
.address-label {
    color: $grey-3;
    margin-bottom: 20px;
}
.wrapper-copy-links {
    display: flex;
    align-items: baseline;
    font-family: $object;
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 13px;
    color: $grey-3;
}
.footer-links {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
}
.footer-link {
    margin: 10px 0 0 20px;
}
.social-links {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    margin-bottom: 50px;
}
.social-link {
    font-family: $object;
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 20px;
    color: $grey-3;
    margin: 10px 50px 0 0;
    &:last-child {
        margin-right: 0;
    }
}
.footer-link,
.contact-link,
.social-link {
    text-decoration: none;
}

@media (min-width: $desktop-small) {
    .footer {
        &.ultra-light {
            .wrapper-copy-links {
                justify-content: flex-end;
            }
        }
        &:not(.ultra-light) {
            padding: 45px 0;
            .wrapper-links {
                display: flex;
                align-items: baseline;
                flex-direction: row-reverse;
                justify-content: space-between;
                width: calc(100% + #{2 * $gutter});
                margin-left: -$gutter;
            }
            .wrapper-copy-links {
                width: percentage(3/8);
                padding: 0 #{$gutter};
            }
        }
    }
    .wrapper-contact {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: calc(100% + #{2 * $gutter});
        margin-left: -$gutter;
        &::before {
            left: $gutter;
            right: $gutter;
        }
    }
    .contact-links {
        margin-bottom: 0;
        width: percentage(3/8);
        padding: 0 #{$gutter};
    }
    .footer-address {
        width: percentage(4/8);
        padding: 0 #{$gutter};
        flex-direction: row;
        justify-content: flex-end;
    }
    .address-label {
        margin: 0 20px 0 0;
    }
    .social-links {
        justify-content: flex-end;
        width: percentage(4/8);
        margin-bottom: 0;
        padding: 0 #{$gutter};
    }
}
@media (min-width: $desktop) {
    .footer {
        &:not(.ultra-light) {
            padding: 105px 0 45px;
            .wrapper-copy-links {
                width: percentage(4/10);
            }
        }
    }
    .contact-links {
        width: percentage(4/10);
    }
    .footer-address {
        width: percentage(5/10);
    }
    .social-links {
        width: percentage(5/10);
    }
}
</style>
