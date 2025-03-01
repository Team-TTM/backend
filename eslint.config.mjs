import globals from "globals";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: [
            "node_modules",
            "dist",],
        files: ["**/*.{js,mjs,cjs,vue}"],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            "no-var": "error", // Interdit l'utilisation de var
            "quotes": ["error", "single"], // Force l'utilisation des guillemets doubles
            "semi": ["error", "always"], // Force l'utilisation de points-virgules
        },
    },
    ...pluginVue.configs["flat/essential"],
];


