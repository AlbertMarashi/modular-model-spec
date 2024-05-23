module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:svelte/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        extraFileExtensions: [".svelte"]
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    overrides: [
        {
            files: ["*.svelte"],
            parser: "svelte-eslint-parser",
            parserOptions: {
                parser: "@typescript-eslint/parser",
            },
        },
    ],
    rules: {
        "arrow-parens": ["error", "as-needed", { requireForBlockBody: false }],
        "no-constant-condition": ["error", { "checkLoops": false }],
        // disallow semi-colon
        "semi": ["error", "never"],
        "quotes": ["error", "double"],
        "array-element-newline": ["error", "consistent"],
        "no-self-assign": "off",
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
        "svelte/indent": ["error", {
            "indentScript": false,
            "indent": 4,
        }],
        "svelte/prefer-style-directive": ["error"],
        "svelte/sort-attributes": ["error"],
        "svelte/shorthand-directive": ["error", {
            "prefer": "always",
        }],
        "svelte/no-spaces-around-equal-signs-in-attribute": ["error"],
        "svelte/html-quotes": ["error", {
            "prefer": "double",
            "dynamic": {
                "quoted": false,
                "avoidInvalidUnquotedInHTML": false
            }
        }],
        "svelte/no-at-html-tags": "warn",
        "svelte/mustache-spacing": ["error", {
            "textExpressions": "always", // or "always"
            "attributesAndProps": "never", // or "always"
            "directiveExpressions": "always", // or "always"
            "tags": {
                "openingBrace": "never",
                "closingBrace": "never",
            }
        }],
        "svelte/max-attributes-per-line": [
            "error",
            {
                "multiline": 1,
                "singleline": 1
            }
        ],
        "svelte/first-attribute-linebreak": [
            "error",
            {
                "multiline": "below", // or "beside"
                "singleline": "beside" // "below"
            }
        ]
    }
}