<script
    lang="ts">
import type { RecordId } from "$lib/pojo_surreal"
import { TokenFlag, type Token } from "./parser/types"
import { score_color } from "./render_utils"
import { scoring_state } from "./scoring.svelte"

let {
    i,
    token,
    branch,
    dragging = $bindable(),
}: {
    i: number | null;
    token: Token
    branch: RecordId<"branch">
    dragging: boolean
} = $props()

let char = $derived(i === null ? null : scoring_state.chars[i])

const getDisplayChar = (char: string | null) => {
    switch (char) {
        case "\n":
            return "↵"
        case "\t":
            return "→"
        case " ":
            return "·"
        case null:
            return "<|ERR|>" //✖
        default:
            return char
    }
}

function score_background() {
    if (i === null) return null
    const rel_i = scoring_state.relative_mapping[i]
    const score = scoring_state.branch_map[branch.id].scores[rel_i]

    return score_color(score)
}

function in_cursor_range(): boolean {
    if (i === null) return false
    const start = Math.min(
        scoring_state.cursor_start,
        scoring_state.cursor_end,
    )
    const end = Math.max(
        scoring_state.cursor_start,
        scoring_state.cursor_end,
    )

    return i >= start && i <= end
}

// Handle click events on individual characters
function handleClick() {
    if (i === null) return
    scoring_state.cursor_start = i
    scoring_state.cursor_end = i
}

// Handle mouse down for selection
function handleMouseDown() {
    if (i === null) return
    dragging = true
    scoring_state.cursor_start = i
    scoring_state.cursor_end = i
}

// Handle mouse over during selection
function handleMouseOver() {
    if (i === null || !dragging) return
    scoring_state.cursor_end = i
}

// Handle mouse up to finalize selection
function handleMouseUp() {
    if (i === null) return
    dragging = false
    scoring_state.cursor_end = i
}

function getClassNames(flags: TokenFlag): string {
    return Object.keys(TokenFlag) // Get all enum keys
        .filter(key => isNaN(Number(key))) // Exclude numeric values (reverse mapping in enums)
        .filter(
            key =>
                (flags & TokenFlag[key as keyof typeof TokenFlag]) !== 0,
        ) // Check if flag is set
        .join(" ") // Join the matching keys as class names
}
</script>

<cell
    style:--background={ i === null ? null : score_background() }
    class={getClassNames(token.flags)}
    class:cursor={ i === scoring_state.cursor_start ||
        i === scoring_state.cursor_end }
    class:cursor-range={ in_cursor_range() }
    class:eof={ char === null }
    class:error={ token.error }
    class:newline={ char == "\n" }
    class:space={ char == " " }
    class:tab={ char == "\t" }
    error={token.error}
    onclick={handleClick}
    onfocus={() => {}}
    onmousedown={handleMouseDown}
    onmouseover={handleMouseOver}
    onmouseup={handleMouseUp}
    role="presentation"
>
    { getDisplayChar(char) }
</cell>
{#if char === "\n"}
    <return></return>
{/if}
<style>
    cell {
        cursor: text;
        white-space: pre;
        background: var(--background);
        /* outline: 1px solid rgb(27, 27, 27); */
        outline-offset: -0.5px;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 30px;
        align-self: center;

        &.tab {
            grid-column: span 3;
        }
        &.error {
            outline-offset: 0;
            font-weight: 600;
            color: var(--red);
            &::after {
                content: "";
                position: absolute;
                border-radius: 4px;
                top: 100%;
                left: -2px;
                padding-top: 3px;
                min-width: calc(100% + 4px);
                background: var(--red);
                z-index: 4;
                color: white;
                display: block;
            }
            &:hover {
                &::after {
                    border-radius: 4px;
                    padding: 6px 4px;
                    content: attr(error);
                }
            }
        }

        &.punctuation {
            color: rgba(255, 255, 255, 0.4);
        }

        &.string {
            color: var(--string);
        }
        &.number {
            color: var(--number);
        }
        &.boolean {
            color: var(--boolean);
        }
        &.null {
            color: var(--null);
        }
        &.keyword {
            color: var(--keyword);
        }
        &.operator {
            color: var(--operator);
        }
        &.comment {
            color: var(--comment);
        }
        &.identifier {
            color: var(--identifier);
        }
        &.function {
            color: var(--function);
        }
        &.variable {
            color: var(--variable);
        }
        &.type {
            color: var(--type);
        }
        &.regex {
            color: var(--regex);
        }
        &.escape {
            color: var(--escape);
        }
        &.bold {
            font-weight: bold;
            color: var(--styling);
        }
        &.italic {
            font-style: italic;
            color: var(--styling);
        }
        &.underline {
            text-decoration: underline;
        }
        &.strikethrough {
            text-decoration: line-through;
        }
        &.heading {
            color: var(--heading);
        }
        &.code {
            color: var(--code);
        }
        &.link {
            color: var(--link);
        }
        &.list {
            color: var(--list);
        }
        &.quote {
            color: var(--quote);
        }
        &.hr {
            color: var(--hr);
        }
        &.language {
            color: var(--code);
        }
        &.space,
        &.tab,
        &.newline {
            color: rgba(255, 255, 255, 0.5);
        }

        &.newline {
            grid-column-end: 0;
        }

        &.cursor-range {
            background: rgba(var(--blue-rgb), 0.2);
            &.cursor {
                /* background: rgba(var(--blue-rgb), 0.5); */
                outline: 2px solid rgba(var(--blue-rgb), 1);
                outline-offset: -1px;
            }
        }

        &.eof {
            background: rgba(var(--red-rgb), 0.1);
            color: var(--red);
            grid-column: span 8;
            /* outline: 2px solid rgba(var(--red-rgb), 0.5); */
        }
    }


    return {
        grid-column-end: -1;
    }
</style>
