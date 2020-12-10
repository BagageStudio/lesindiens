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
        sBlokVersion: netlifyEnv === 'development' ? 'draft' : 'published',
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

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [],

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
    build: {},

    styleResources: {
        scss: ['~/assets/scss/abstracts/_variables.scss']
    }
};
