<script lang="ts">
import hljs from "highlight.js"
import "$lib/markdown-blocks/code-theme.css"

export let editable = true
export let language: string | null | undefined
export let code: string

let pre: HTMLPreElement
let textarea: HTMLTextAreaElement
let code_el: HTMLElement

hljs.registerLanguage("tokens", _ => {
    return {
        contains: [
            {
                className: "type",
                begin: /<\|/,
                end: /\|>/
            }
        ]
    }
})

const registered_languages = new Set(hljs.listLanguages())

const renames: Record<string, string> = {
    "jsonl": "json",
    "pseudocode": "plaintext",
    "voice": "markdown",
}

$: response_format_parts = language?.split(":") || []
$: language_format = response_format_parts[response_format_parts.length - 1]
$: renamed_language = renames[language_format] || language_format || "plaintext"
$: lines = highlighted_code.split("\n")
$: digits = lines.length.toString().length
$: highlighted_code = registered_languages.has(renamed_language) ? highlight(renamed_language, code) : code
$: numbers = lines.map((_, i) => {
    const number = (i + 1).toString()

    return [
        "0".repeat(digits - number.length),
        number,
    ]
})

function highlight (language_format: string, code: string): string {
    return hljs.highlight(code, {
        language: renames[language_format] || language_format || "plaintext",
    }).value
}

function handle_keydown(event: KeyboardEvent) {
    if (event.key === "Tab") {
        event.preventDefault()
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const indentSize = 4
        let newCode = code
        let newStart = start
        let newEnd = end

        if (event.shiftKey) {
            // Unindent
            const lineStart = code.lastIndexOf("\n", start - 1) + 1
            const lineEnd = code.indexOf("\n", end) === -1 ? code.length : code.indexOf("\n", end)
            const selectedText = code.slice(lineStart, lineEnd)
            const lines = selectedText.split("\n")

            let totalRemoved = 0
            const unindentedLines = lines.map((line, index) => {
                const spacesToRemove = Math.min(line.search(/\S|$/), indentSize)
                totalRemoved += spacesToRemove
                return line.slice(spacesToRemove)
            })

            const unindentedText = unindentedLines.join("\n")

            if (unindentedText !== selectedText) {
                newCode = code.slice(0, lineStart) + unindentedText + code.slice(lineEnd)
                newStart = start - Math.min(start - lineStart, indentSize)
                newEnd = end - totalRemoved
            }
        } else {
            // Indent (no changes needed here as it's working correctly)
            const lineStart = code.lastIndexOf("\n", start - 1) + 1
            const lineEnd = code.indexOf("\n", end) === -1 ? code.length : code.indexOf("\n", end)
            const selectedText = code.slice(lineStart, lineEnd)
            const lines = selectedText.split("\n")

            const indentedLines = lines.map(line => " ".repeat(indentSize) + line)
            const indentedText = indentedLines.join("\n")

            newCode = code.slice(0, lineStart) + indentedText + code.slice(lineEnd)
            newStart = start + indentSize
            newEnd = end + indentedText.length - selectedText.length
        }

        if (newCode !== code) {
            code = newCode
            // Set cursor position or selection after the update
            setTimeout(() => {
                textarea.setSelectionRange(newStart, newEnd)
            }, 0)
        }
    }
}




</script>
<pre
    bind:this={ pre }
    class:editable>
            <code bind:this={ code_el }>
                <div class="line">
                    <div class="number small">{ Array(digits).fill(" ").join("") }</div>
                </div>
                {#each lines as line, i}
                    <div class="line">
                        <div class="number"><span class="zero">{ numbers[i][0] }</span>{ numbers[i][1] }</div>
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        <div class="code">{@html line}</div>
                    </div>
                {/each}
                {#if editable}
                    <div class="line textarea">
                        <div class="number">{ Array(digits).fill(" ").join("") }</div>
                        <textarea
                            bind:this={ textarea }
                            spellcheck="false"
                            on:keydown={ handle_keydown }
                            bind:value={ code }/>
                    </div>
                {/if}
                <div class="line">
                    <div class="number small">{ Array(digits).fill(" ").join("") }</div>
                </div>
            </code>
</pre>
<style>
/*
.copy
    display inline-flex
    cursor pointer
    color white
    font-size 20px
    padding 6px
    border-radius 4px
    user-select none
    color transparify(white, 80%)
    background mix(white, $dark_app, 15%)
    margin-left auto
    &:hover, &:active
        color white
        background mix(white, $dark_app, 25%)

.header
    border-bottom 1px solid transparify(white, 10%)
    padding 4px
    gap 6px
    display contents
    align-items center
    justify-content space-between
    &.show-header
        display flex
    &:not(.show-header)
        .copy
            position absolute
            top 0
            right 0
            margin 10px

.number
    white-space pre
    color white
    user-select none
    background transparify(white, 6%)
    padding 0 8px
    letter-spacing 2px
    .zero
        display inline
        opacity 0.2

    &.small
        height 8px

pre
    position relative
    font-size 14px
    background transparify(white, 6%)
    font-family "Source Code Pro", monospace
    border-radius 4px
    line-height 1.6em
    &.editable
        border-radius 0
    width 100%
    white-space normal

.textarea
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    padding-top 8px
    padding-bottom 8px
    .number
        opacity 0

textarea
    font-size inherit
    line-height inherit
    white-space pre-wrap
    // word-break break-all
    font-family inherit
    width 100%
    z-index 1
    color transparent
    resize none
    background transparent
    opacity 1
    outline none
    caret-color white
    padding 0
    height 100%
    margin 0

code
    width 100%
    display block
    position relative

.code
    white-space pre-wrap
    max-width 100%
    // word-break break-all
    overflow-wrap anywhere

.line
    display flex
    gap 16px
    padding-right 16px */


.number {
    white-space: pre-wrap;
    color: rgba(var(--dark-rgb), 0.4);
    user-select: none;
    background: rgba(var(--dark-rgb), 0.06);
    padding: 0 6px;
    opacity: 0.4;
    letter-spacing: 2px;
}

.number .zero {
    display: inline;
    opacity: 0.3;
}

.number.small {
    height: 8px;
}

pre {
    position: relative;
    font-size: 12px;
    background: rgba(var(--background-rgb), 0.3);
    border: 1px solid rgba(var(--foreground-rgb), 0.08);
    font-family: "Fira Code", monospace;
    border-radius: 4px;
    width: 100%;
    white-space: normal;
    &:focus-within {
        outline: 2px solid rgba(var(--color-rgb), 0.3);
    }
}

code {
    width: 100%;
    display: block;
}

.line {
    display: flex;
    gap: 16px;
    padding-right: 16px;
    line-height: 150%;
}

.code {
    white-space: pre-wrap;
}

textarea {
    font-size: inherit;
    line-height: inherit;
    white-space: pre-wrap;
    /* word-break break-all; */
    font-family: inherit;
    width: 100%;
    z-index: 1;
    color: transparent;
    resize: none;
    background: transparent;
    opacity: 1;
    outline: none;
    caret-color: white;
    padding: 0;
    height: 100%;
    margin: 0;
}

.textarea {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 8px;
    padding-bottom: 8px;
}



</style>