<template>
    <footer class="footer" :class="{ 'ultra-light': theme === 'ultra-light' }">
        <div v-if="theme !== 'ultra-light'" class="contact-links">
            <a
                v-for="contactLink in content.contact_links"
                :key="contactLink._uid"
                :href="contactLink.link.url"
                class="contact-link"
            >
                {{ contactLink.label }}
            </a>
        </div>
        <div class="wrapper-copy-links">
            <span class="copy">{{ content.copy }}</span>
            <div class="footer-links">
                <nuxt-link
                    v-for="footerLink in content.footer_links"
                    :key="footerLink.id"
                    :to="footerLink.link.story.full_slug"
                    class="footer-link"
                    >{{ footerLink.label }}</nuxt-link
                >
            </div>
        </div>
        <div v-if="theme !== 'ultra-light'" class="footer-address">
            <span class="address-label">Siège social</span>
            <span class="address-content">{{ content.address }}</span>
        </div>
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
    </footer>
</template>

<script>
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
    computed: {},
    watch: {},
    methods: {}
};
</script>
<style scoped lang="scss">
.footer {
    padding: 38px 0;
}
.contact-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
    }
}
</style>
