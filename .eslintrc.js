module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: ['@nuxtjs', 'prettier', 'prettier/vue', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
    plugins: ['prettier'],
    // add your custom rules here
    rules: {
        'no-console': 'off',
        'no-unused-vars': 'warn',
        'no-useless-escape': 'off',
        quotes: ['error', 'single'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'arrow-parens': ['error', 'as-needed'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/max-attributes-per-line': 'off',
        'vue/html-indent': 'off',
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'always'
                }
            }
        ],
        'vue/no-v-html': 'off'
    }
};
