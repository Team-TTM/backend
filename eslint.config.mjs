import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {

        ignores: [
            'node_modules',
            'dist',],
        files: ['**/*.{js,mjs,cjs,vue}'],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            'no-var': 'error', // Interdit l'utilisation de var
            'quotes': ['error', 'single'], // Force l'utilisation des guillemets doubles
            'semi': ['error', 'always'], // Force l'utilisation de points-virgules
            'no-multi-spaces': ['error', { 'ignoreEOLComments': false }],
            'space-in-parens': ['error', 'never'],
            'no-trailing-spaces': 'error',
            'eqeqeq': ['error', 'always'],
            'indent': ['error', 4],
            'no-unused-vars': ['warn'],
            'consistent-return': 'error',
            'no-console': ['warn'],
            'curly': ['error', 'all'],
            'prefer-const': 'error',
        },
    },
];


