<script
    lang="ts">
import type { BranchLayout } from "./scoring.svelte"
import CharsRenderer from "./CharsRenderer.svelte"


const {
    branch,
    layout,
}: {
    branch: string
    layout: BranchLayout
} = $props()

</script>

<grid>
    <!-- <split>
        <Icon
            icon={CallSplit} />
    </split> -->
    {#each layout as render_token}
        <!-- {#key render_token} -->
        <CharsRenderer
            branch={branch}
            render_token={render_token}
        />
        <!-- {/key} -->
    {/each}
    <!-- <split>
        <Icon
            icon={CallSplit} />
    </split> -->
</grid>

<style>

grid {
    --gap: 0.1ch;
    position: relative;
    z-index: 1;
    font-size: 14px;
    display: grid;
    font-weight: 450;
    max-width: 100%;
    min-width: 0;
    font-family: "Fira Code", monospace;
    user-select: none;
    grid-template-columns: repeat(80, 1fr);
    grid-auto-rows: 30px;
    /* gap: 3px 0; */
    /* background: rgba(var(--foreground-rgb), 0.03); */
    /* border: 1px solid rgba(var(--foreground-rgb), 0.1); */
    /* border-radius: 16px; */

}

split {
    grid-column: span 4;
    align-items: center;
    justify-content: center;
    display: inline-flex; 
    /* outline: 2px solid var(--blue); */
    background: rgba(var(--purple-rgb), 0.2);
    outline-offset: -2px;
    border-radius: 6px;
    color: var(--purple);
    font-size: 18px;
    margin-left: 2px;
    margin-right: 2px;
    :global {
        > * {
            transform: rotate(90deg);
        }
    }

}
</style>
