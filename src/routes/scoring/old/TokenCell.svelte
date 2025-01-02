<script
    lang="ts">
import type { RecordId } from "$lib/pojo_surreal";
import Cell from "../Cell.svelte"
import type { RenderToken } from "../scoring.svelte";

let { 
    render_token,
    branch,
}: {
    render_token: RenderToken
    branch: RecordId<"branch">
} = $props()

let text = $derived(render_token.text)
</script>

<special-token
    style:--length={render_token.token.len}
    class:start={
        text === "<|end_turn|>" ||
        text === "<|role|>" ||
        text === "<|end_message|>"
    }>
    <chars>
        {#each text as char}
            { char }
        {/each}
    </chars>
    {#each { length: render_token.token.len }, i (i)}
        <Cell
            render_token={render_token}
            i={render_token.token.start + i}
            branch={branch}
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
