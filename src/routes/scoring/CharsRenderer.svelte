<script lang="ts">
import type { RecordId } from "$lib/pojo_surreal";
import Cell from "./Cell.svelte";
import { TokenFlag, TokenKeys } from "./parser/types";
import { scoring_state, type RenderToken } from "./scoring.svelte";

let {
    render_token,
    branch,
}: {
    render_token: RenderToken
    branch: string
} = $props()

function getClassNames() {
    const flags = render_token.token.flags
    const class_names: string[] = TokenKeys // Get all enum keys
        .filter(
            key =>
                (flags & TokenFlag[key as keyof typeof TokenFlag]) !== 0,
        ) // Check if flag is set

    if (render_token.token.error) class_names.push("error")

    return class_names.join(" ")
}

</script>
<chars
    class:special={render_token.token.flags & TokenFlag.special}
    style:--length={render_token.len}
    class:start={render_token.token.flags & TokenFlag.special && (
        render_token.text === "<|end_turn|>" ||
        render_token.text === "<|role|>" ||
        render_token.text === "<|end_message|>"
    )}
    class={getClassNames()} 
    class:error={render_token.token.error}
    class:return={render_token.text === "<|content|>"}
    style:--error-str={JSON.stringify(render_token.token.error)}>
    <inner-chars>{ render_token.text }</inner-chars>
    {#each { length: render_token.len }, i}
        <Cell
            render_token={render_token}
            i={i}
            score={scoring_state.branch_map[branch].scores[render_token.rel_start + i]}
        />
    {:else}
        <Cell
            render_token={render_token}
            i={null}
        />
{/each}
</chars>
<return></return>
<style>

chars {
    display: contents;

    &.tab {
        grid-column: span 3;
    }
    &.error {
        :global {
            > * {
                outline-offset: 0;
                font-weight: 600;
                color: color-mix(in srgb, var(--red), var(--foreground) 60%);
                &::after {
                    content: "";
                    font-size: 14px;
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
                        content: var(--error-str);
                    }
                }
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
        grid-column: span 8;
    }

    &.return + return {
        display: flex;
    }
}

inner-chars {
    display: none;
}

.special {
    display: grid;
    position: relative;
    grid-column: span var(--length);
    grid-template-rows: 1fr;
    grid-auto-flow: column;
    z-index: 2;
    outline: 1px solid var(--special);
    outline-offset: -0.5px;
    border-radius: 4px;
    color: var(--special);
    letter-spacing: var(--gap);
    flex-direction: column;
    align-items: center;
    align-self: center;
    &.start {
        grid-column: 1 / span var(--length);
    }

    :global {
        cell {
            color: transparent;
            outline: none;
        }
    }
    inner-chars {
        position: absolute;
        display: flex;
        z-index: 2;
        pointer-events: none;
    }
}

return {
    display: none;
    grid-column-end: -1;
}
</style>