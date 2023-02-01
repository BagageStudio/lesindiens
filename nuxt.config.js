import Sass from 'sass';

const customSass = {
    implementation: Sass
};

/*
 ** NOTE:
 ** The NODE_ENV will always be equal to 'production' when we generate
 ** the website. Thus, we don't have a dev/production env variable
 ** for the preproduction environnement.
 ** The NETLIFY_ENV variable allow us to set a dev/production variable
 ** totaly decorrelated from the NODE_ENV variable.
 ** SEE: https://www.netlify.com/docs/continuous-deployment/#environment-variables
 */
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const netlifyEnv = process.env.NETLIFY_ENV;
const isProdEnv = netlifyEnv === 'production';
const websiteUrl = process.env.URL || `http://${host}:${port}`;
const preview = process.env.SBLOK_VERSION === 'draft';

export default {
    // Target (https://go.nuxtjs.dev/config-target)
    target: 'static',

    generate: {
        fallback: preview
    },

    publicRuntimeConfig: {
        isDevEnv: process.env.NETLIFY_ENV === 'development',
        sBlokVersion: process.env.SBLOK_VERSION || 'published',
        netlifyEnv: process.env.NETLIFY_ENV,
        preview
    },

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: 'Les Indiens : Studio de Branding et de Product Design à Nantes',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content:
                    'Le Studio Les Indiens est un duo de créatif expert dans le Branding et le Product Design. Nous accompagnons des startups à concevoir des identités visuelles fortes et des produits performants.'
            },
            {
                hid: 'og:title',
                property: 'og:title',
                content: 'Les Indiens : Studio de Branding et de Product Design à Nantes'
            },
            {
                hid: 'og:description',
                property: 'og:description',
                content:
                    'Le Studio Les Indiens est un duo de créatif expert dans le Branding et le Product Design. Nous accompagnons des startups à concevoir des identités visuelles fortes et des produits performants.'
            },
            {
                hid: 'og:site_name',
                property: 'og:site_name',
                content: 'Les Indiens'
            },
            {
                hid: 'og:url',
                property: 'og:url',
                content: 'https://www.lesindiens.fr'
            },
            {
                hid: 'og:image',
                property: 'og:image',
                content: 'https://www.lesindiens.fr/share.png'
            },
            {
                hid: 'og:image:width',
                property: 'og:image:width',
                content: '1200'
            },
            {
                hid: 'og:image:height',
                property: 'og:image:height',
                content: '630'
            },
            {
                hid: 'og:image:type',
                property: 'og:image:type',
                content: 'image/jpg'
            },
            {
                hid: 'og:image:alt',
                property: 'og:image:alt',
                content: 'Les Indiens'
            },
            {
                hid: 'twitter:card',
                name: 'twitter:card',
                content: 'summary_large_image'
            },
            {
                hid: 'twitter:site',
                name: 'twitter:site',
                content: '@LesIndiens'
            },
            {
                hid: 'twitter:creator',
                name: 'twitter:creator',
                content: '@LesIndiens'
            },
            {
                hid: 'twitter:title',
                name: 'twitter:title',
                content: 'Les Indiens : Studio de Branding et de Product Design à Nantes'
            },
            {
                hid: 'twitter:description',
                property: 'twitter:description',
                content:
                    'Le Studio Les Indiens est un duo de créatif expert dans le Branding et le Product Design. Nous accompagnons des startups à concevoir des identités visuelles fortes et des produits performants.'
            },
            {
                hid: 'twitter:image',
                name: 'twitter:image',
                content: 'https://www.lesindiens.fr/share.png'
            }
        ],
        link: [
            {
                rel: 'icon',
                href: '/favicon.ico',
                sizes: 'any'
            },
            {
                rel: 'icon',
                href: '/icon.svg',
                type: 'image/svg+xml'
            },
            {
                rel: 'apple-touch-icon',
                href: '/apple-touch-icon.png'
            },
            {
                rel: 'manifest',
                href: '/manifest.webmanifest'
            }
        ]
    },

    loading: false,

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: ['~assets/scss/main.scss'],

    server: {
        host: '0.0.0.0' // pour accèder au site depuis le réseau lan
    },

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: ['~/plugins/preview.client.js', '~/plugins/globals', '~/plugins/breakpoints', '~/plugins/stereorepo'],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        '@nuxtjs/proxy',
        '@nuxtjs/axios',
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        '@nuxtjs/style-resources',
        [
            'storyblok-nuxt',
            {
                accessToken: process.env.SBLOK_PREVIEW_TOKEN,
                cacheProvider: 'memory'
            }
        ]
    ],

    privateRuntimeConfig: {
        spotifySecret: process.env.SPOTIFY_SECRET
    },
    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [],

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        transpile: ['ogl', /@stereorepo/, 'gsap'],
        loaders: {
            scss: customSass
        },
        extend(config) {
            config.module.rules.push({
                test: /\.(vert|frag|glsl)$/,
                use: 'raw-loader'
            });
        }
    },

    vue: {
        config: {
            // Giving access to performances in the inspector
            devtools: process.env.NETLIFY_ENV === 'development',
            performance: process.env.NETLIFY_ENV === 'development'
        }
    },

    styleResources: {
        scss: [
            '~/assets/scss/abstracts/_variables.scss',
            '~/assets/scss/abstracts/_animations.scss',
            '~/assets/scss/abstracts/_functions.scss',
            '~/assets/scss/abstracts/_mixins.scss',
            '~/assets/scss/abstracts/_placeholders.scss'
        ]
    },

    // Robots config
    robots: () => {
        return isProdEnv
            ? { UserAgent: '*', Disallow: ['/404'], Sitemap: `${websiteUrl}/sitemap.xml` }
            : { UserAgent: '*', Disallow: '/' };
    },

    axios: {
        baseURL: process.env.DEPLOY_PRIME_URL || 'http://localhost:3000'
    },
    proxy: {
        '/.netlify': {
            target: 'http://localhost:9000',
            pathRewrite: {
                '^/.netlify/functions': ''
            }
        }
    }
};
