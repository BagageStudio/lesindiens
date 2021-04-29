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
const websiteUrl = process.env.URL || `http://${host}:${port}`;

export default {
    // Target (https://go.nuxtjs.dev/config-target)
    target: 'static',

    publicRuntimeConfig: {
        isDevEnv: process.env.NETLIFY_ENV === 'development',
        sBlokVersion: process.env.SBLOK_VERSION || 'published',
        netlifyEnv: process.env.NETLIFY_ENV
    },

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        title: 'lesindiens',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: ['~assets/scss/main.scss'],

    server: {
        host: '0.0.0.0' // pour accèder au site depuis le réseau lan
    },

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: ['~/plugins/globals', '~/plugins/webgl', '~/plugins/breakpoints', '~/plugins/stereorepo'],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
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
    }
};
