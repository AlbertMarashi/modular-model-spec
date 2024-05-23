<script lang="ts">
import type { MdxJsxFlowElement } from "mdast-util-mdx"
import Unsupported from "./Unsupported.svelte"
import GenericBlock from "./GenericBlock.svelte"
import ColumnBlock from "./ColumnBlock.svelte"
import ScrollbarRegion from "$lib/ScrollbarRegion.svelte"


export let block: MdxJsxFlowElement

</script>
<ScrollbarRegion>
    <columns>
        {#each block.children as child}
            {#if child.type === "mdxJsxFlowElement"}
                {#if child.name === "Column"}
                    <ColumnBlock block={child}/>
                {:else}
                    <Unsupported/>
                {/if}
            {:else}
                <GenericBlock block={child}/>
            {/if}
        {/each}
    </columns>
</ScrollbarRegion>
<style>
columns {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 100%;
    overflow-x: auto;
}

</style>