<script lang="ts">
import hljs from "highlight.js"
// import Tag from "$lib/display/Tag.svelte"
import "./code-theme.css"

export let language: string | null | undefined
export let code: string

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

$: response_format_parts = language?.split(":") || []
$: language_format = response_format_parts[response_format_parts.length - 1]
let pre: HTMLPreElement
let code_el: HTMLElement

const renames: Record<string, string> = {
    "jsonl": "json",
    "pseudocode": "plaintext",
    "voice": "markdown",
}

$: highlighted_code = hljs.highlight(code, {
    language: renames[language_format] || language_format || "plaintext",
})

$: lines = highlighted_code.value.split("\n")
$: digits = lines.length.toString().length
$: numbers = lines.map((_, i) => {
    const number = (i + 1).toString()

    return [
        "0".repeat(digits - number.length),
        number,
    ]
})

// function copy() {
//     navigator.clipboard.writeText(code)
// }

</script>
<pre bind:this={ pre }>
        <div
            class="header"
            class:show-header={ false }>
            <!-- {#if language}
                <Tag>{ language }</Tag>
            {/if} -->
            <!-- <div
                class="copy"
                on:keypress={ e => e.key === "Enter" ? copy() : null }
                on:click={ copy }>
                <Icon icon={ContentCopy}/>
            </div> -->
        </div>
        <code bind:this={ code_el }>
            <div class="line">
                <div class="number small">{ Array(digits).fill(" ").join("") }</div>
            </div>
            {#each lines as line, i}
                <span class="line">
                    <div class="number"><span class="zero">{ numbers[i][0] }</span>{ numbers[i][1] }</div>
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    <div class="code">{@html line}</div>
                </span>
            {/each}
            <div class="line">
                <div class="number small">{ Array(digits).fill(" ").join("") }</div>
            </div>
        </code>
</pre>
<style>
/* .copy {
    display: inline-flex;
    cursor: pointer;
    color: white;
    font-size: 20px;
    padding: 6px;
    border-radius: 4px;
    user-select: none;
    color: rgba(255, 255, 255, 0.8);
    background: color-mix(white 15%, var(--dark-app));
    margin-left: auto;
}

.copy:hover,
.copy:active {
    color: white;
    background: rgba(var(--foreground-rgb), 0.1);
} */

.header {
    border-bottom: 1px solid rgba(var(--dark-rgb), 0.1);
    padding: 4px;
    display: contents;
    align-items: center;
    justify-content: space-between;
}

.header.show-header {
    display: flex;
}

/* .header:not(.show-header) .copy {
    position: absolute;
    top: 0;
    right: 0;
    margin: 10px;
} */

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

</style>