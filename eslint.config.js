import js from "@eslint/js"
import ts from "typescript-eslint"
import svelte from "eslint-plugin-svelte"
import globals from "globals"

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        }
    },
    {
        ignores: [
            "build/",
            ".svelte-kit/",
            ".vercel/",
            "dist/",
            "src/lib/queries.ts"
        ]
    },
    {
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
                "switchCase": 1,
                "indent": 4,
            }],
            "svelte/prefer-style-directive": ["error"],
            "svelte/sort-attributes": ["error"],
            "svelte/shorthand-directive": ["error", {
                "prefer": "never",
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
                    "singleline": "below" // "below"
                }
            ],
        },
    },
]