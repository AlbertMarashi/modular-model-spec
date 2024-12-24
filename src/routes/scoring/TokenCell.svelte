<script
    lang="ts">
import type { RecordId } from "$lib/pojo_surreal";
import Cell from "./Cell.svelte"
import type { Token } from "./parser/types"
import { scoring_state } from "./scoring.svelte";

let { 
    token,
    branch,
    dragging = $bindable(),
}: {
    token: Token
    branch: RecordId<"branch">
    dragging: boolean
} = $props()

let text = $derived(scoring_state.chars.slice(token.start, token.start + token.len))
</script>

<special-token
    style:--length={token.len}
    class:start={text === "<|end_turn|>" ||
        text === "<|role|>" ||
        text === "<|end_message|>"}
    >
    <chars>
        {#each text as char}
            { char }
        {/each}
    </chars>
    {#each { length: token.len }, i}
        <Cell
            token={token}
            i={token.start + i}
            branch={branch}
            bind:dragging={dragging}
        />
    {/each}
</special-token>
{#if text === "<|content|>"}
    <return></return>
{/if}
<style>
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

</style>
