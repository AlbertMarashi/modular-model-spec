<script lang="ts">
    import { type RecordId } from "$lib/pojo_surreal";
    import { TokenFlag, type Token } from "./parser/types";
    import { scoring_state } from "./scoring.svelte";

    let {
        branch,
        tokens,
        cursor_start = $bindable(),
        cursor_end = $bindable(),
        dragging = $bindable(),
    }: {
        branch: RecordId<"branch">;
        tokens: Token[];
        cursor_start: number;
        cursor_end: number;
        dragging: boolean;
    } = $props();

    const getDisplayChar = (char: string | null) => {
        switch (char) {
            case "\n":
                return "↵";
            case "\t":
                return "→";
            case " ":
                return "·";
            case null:
                return "✖ ERR ✖";
            default:
                return char;
        }
    };

    function score_background(i: number) {
        const rel_i = scoring_state.relative_mapping[i];
        const score = scoring_state.branch_map[branch.id].scores[rel_i];

        return score < 0
            ? `rgba(var(--red-rgb), ${Math.abs(score) * 0.75})`
            : `rgba(var(--green-rgb), ${Math.abs(score) * 0.75})`;
    }

    function in_cursor_range(i: number | null): boolean {
        if (i === null) return false;
        const start = Math.min(cursor_start, cursor_end);
        const end = Math.max(cursor_start, cursor_end);

        return i >= start && i <= end;
    }

    // Handle click events on individual characters
    function handleClick(i: number | null) {
        if (i === null) return;
        cursor_start = i;
        cursor_end = i;
    }

    // Handle mouse down for selection
    function handleMouseDown(i: number | null) {
        if (i === null) return;
        dragging = true;
        cursor_start = i;
        cursor_end = i;
    }

    // Handle mouse over during selection
    function handleMouseOver(i: number | null) {
        if (i === null || !dragging) return;
        cursor_end = i;
    }

    // Handle mouse up to finalize selection
    function handleMouseUp(i: number | null) {
        if (i === null) return;
        dragging = false;
        cursor_end = i;
    }

    function getClassNames(flags: TokenFlag): string {
        return Object.keys(TokenFlag) // Get all enum keys
            .filter((key) => isNaN(Number(key))) // Exclude numeric values (reverse mapping in enums)
            .filter(
                (key) =>
                    (flags & TokenFlag[key as keyof typeof TokenFlag]) !== 0,
            ) // Check if flag is set
            .join(" "); // Join the matching keys as class names
    }
</script>

<grid>
    {#snippet cell(token: Token, i: number | null)}
        {@const char = i !== null ? scoring_state.chars[i] : null}
        <cell
            style:--background={i === null ? null : score_background(i)}
            error={token.error}
            class={getClassNames(token.flags)}
            class:thread={token.lang === "thread"}
            class:error={token.error}
            class:eof={char === null}
            class:cursor-range={in_cursor_range(i)}
            class:cursor={i === cursor_start || i === cursor_end}
            role="presentation"
            onfocus={() => {}}
            class:space={char == " "}
            class:tab={char == "\t"}
            class:newline={char == "\n"}
            onclick={() => handleClick(i)}
            onmousedown={() => handleMouseDown(i)}
            onmouseover={() => handleMouseOver(i)}
            onmouseup={() => handleMouseUp(i)}
        >
            {getDisplayChar(char)}
        </cell>
        {#if char === "\n"}
            <return></return>
        {/if}
    {/snippet}
    {#each tokens as token}
        {@const text = scoring_state.chars.slice(
            token.start,
            token.start + token.len,
        )}
        {#if token.error && !text}
            {@render cell(token, null)}
        {:else if token.flags & TokenFlag.special}
            <special-token
                style:--length={token.len}
                class:content={text === "<|content|>"}
                class:start={text === "<|end_turn|>" ||
                    text === "<|role|>" ||
                    text === "<|end_message|>"}
            >
                <chars>
                    {#each text as char}
                        {char}
                    {/each}
                </chars>
                {#each { length: token.len }, i}
                    {@render cell(token, token.start + i)}
                {/each}
            </special-token>
            {#if text === "<|content|>"}
                <return></return>
            {/if}
        {:else}
            {#each { length: token.len }, i}
                {@render cell(token, token.start + i)}
            {/each}
        {/if}
    {/each}
</grid>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap");

    :root {
        /* Markdown marks */
        --text: inherit;
        --styling: #7981db;
        --heading: #1d6a89;
        --code: #c7a1c5;
        --link: #2563eb;
        --list: #5476ab;
        --quote: #6b7280;
        --hr: #9ca3af;

        /* Thread marks */
        --special: #5ec0b9;

        /* Code marks */
        --punctuation: #6b7280;
        --tag: #2563eb;
        --keyword: #d454d6;
        --ident: #5576ac;
        --function: #2563eb;
        --string: #059669;
        --number: #26dc9f;
        --boolean: #d16b1d;
        --null: #9333ea;
        --type: #0891b2;
        --property: #0891b2;
        --comment: #6b7280;
        --regexp: #d34e4e;
        --bracket: #6b7280;
    }

    grid {
        --gap: 0.1ch;
        font-family: monospace;
        font-size: 14px;
        display: grid;
        /* gap: 3px 0; */
        font-weight: 450;
        grid-template-columns: repeat(auto-fill, calc(1ch + var(--gap)));
        max-width: 100%;
        min-width: 0;
        font-family: "Fira Code", monospace;
        user-select: none;
        /* background: rgba(var(--foreground-rgb), 0.03); */
        /* border: 1px solid rgba(var(--foreground-rgb), 0.1); */
        /* border-radius: 16px; */
    }

    special-token {
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
        &.start {
            grid-column: 1 / span var(--length);
        }
        cell {
            color: transparent;
            outline: none;
        }
        chars {
            position: absolute;
            display: flex;
            z-index: 1;
            pointer-events: none;
        }
    }

    return {
        grid-column-end: -1;
    }

    cell {
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

        &.tab {
            grid-column: span 3;
        }
        &.error {
            outline-offset: 0;

            &::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 0;
                padding-top: 3px;
                min-width: 100%;
                background: rgba(200, 50, 50, 1);
                z-index: 4;
                color: white;
                display: block;
            }
            &:hover {
                &::after {
                    border-radius: 4px;
                    padding: 4px 2px;
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

        &.cursor-range {
            background: rgba(var(--blue-rgb), 0.2);
            &.cursor {
                /* background: rgba(var(--blue-rgb), 0.5); */
                outline: 2px solid rgba(var(--blue-rgb), 1);
                outline-offset: -1px;
            }
        }

        &.eof {
            color: var(--red);
            grid-column: span 8;
            /* outline: 2px solid rgba(var(--red-rgb), 0.5); */
        }
    }
</style>
