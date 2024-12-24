<script lang="ts">
import { type RecordId } from "$lib/pojo_surreal";
import { TokenFlag, type Token } from "./parser/types";
import Cell from "./Cell.svelte";
import TokenCell from "./TokenCell.svelte";


let {
    branch,
    tokens,
    dragging = $bindable(),
}: {
    branch: RecordId<"branch">;
    tokens: Token[];
    dragging: boolean;
} = $props();
</script>

<grid>
    {#each tokens as token, i}
        {#if token.error && !token.len}
            <Cell
                token={token}
                i={null}
                branch={branch}
                bind:dragging={dragging}
            />
        {:else if token.flags & TokenFlag.special}
            <TokenCell token={token} branch={branch} bind:dragging={dragging} />
        {:else}
            {#each { length: token.len }, i}
                <Cell
                    token={token}
                    i={token.start + i}
                    branch={branch}
                    bind:dragging={dragging}
                />
            {/each}
        {/if}
    {/each}
    <last>

    </last>
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
        --special: #73fff681;

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
        position: relative;
        font-family: monospace;
        z-index: 1;
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

</style>
