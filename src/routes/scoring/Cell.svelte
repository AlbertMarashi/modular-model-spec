<script
    lang="ts">
import { scoring_state, type RenderToken } from "./scoring.svelte"
import { score_color } from "./utils"

const {
    i,
    render_token,
    score,
}: {
    i: number | null;
    render_token: RenderToken
    score?: number
} = $props()


function display(char: string | null) {
    switch (char) {
        case " ":
            return "·"
        case "\n":
            return "↵"
        case "\t":
            return "⇥"
        case null:
            return "<|ERR|>" //✖
        default:
            return char
    }
}

const char = i === null ? null : render_token.text[i]
const g_i = i === null ? null : i + render_token.start
const display_char = display(char)

// class:cursor={ g_i === scoring_state.cursor_start || g_i === scoring_state.cursor_end }
</script>
<cell
    style:--background={ score ? score_color(score) : null }
    class:cursor-range={ g_i === null ? null : g_i >= scoring_state.cursor_min && g_i <= scoring_state.cursor_max }
    class:eof={ char === null }
    class:error={ render_token.token.error }
    class:newline={ char === "\n" }
    class:space={ char === " " }
    class:tab={ char === "\t" }
    i={g_i}
    role="presentation">
    { display_char }
</cell>
<return></return>
<style>
    cell {
        cursor: text;
        white-space: pre;
        background: var(--background);
        outline-offset: -0.5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 30px;

        &.space,
        &.tab,
        &.newline {
            color: rgba(255, 255, 255, 0.5);
            font-size: 18px;
            min-width: 0;
        }

        &.tab {
            grid-column: span 3;
        }
        &.newline {
            grid-column: span 2;
        }

        &.newline {
            grid-column-end: 0;
            + return {
                display: inline-flex;
            }
        }

        &.cursor-range {
            background: rgba(var(--blue-rgb), 0.2);
            &.cursor {
                outline: 2px solid rgba(var(--blue-rgb), 1);
                outline-offset: -1px;
            }
        }

        &.eof {
            background: rgba(var(--red-rgb), 0.1);
            color: var(--red);
            grid-column: span 8;
        }
    }


    return {
        display: none;
        grid-column-end: -1;
    }
</style>
