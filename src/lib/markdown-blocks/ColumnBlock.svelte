<script lang="ts">
import type { MdxJsxFlowElement } from "mdast-util-mdx"
import GenericBlock from "./GenericBlock.svelte"


export let block: MdxJsxFlowElement

</script>
<column>
    {#each block.children as child}
        <GenericBlock block={child}/>
    {/each}
</column>
<style>
column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-width: 350px;
}
</style>