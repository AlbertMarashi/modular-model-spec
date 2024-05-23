<script lang="ts">
import type { MdxJsxFlowElement } from "mdast-util-mdx"
import Unsupported from "./Unsupported.svelte"
import SystemBlock from "./SystemBlock.svelte"
import MessageBlock from "./MessageBlock.svelte"
import GenericBlock from "./GenericBlock.svelte"


export let block: MdxJsxFlowElement

</script>
<column>
    {#each block.children as child}
        {#if child.type === "mdxJsxFlowElement"}
            {#if child.name === "Message"}
                <MessageBlock block={child}/>
            {:else if child.name === "SystemConfig"}
                <SystemBlock block={child}/>
                <Unsupported/>
            {/if}
        {:else}
            <GenericBlock block={child}/>
        {/if}
    {/each}
</column>
<style>
column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>