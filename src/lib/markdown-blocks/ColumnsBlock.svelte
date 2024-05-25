<script lang="ts">
import type { MdxJsxFlowElement } from "mdast-util-mdx"
import GenericBlock from "./GenericBlock.svelte"
import ScrollbarRegion from "$lib/ScrollbarRegion.svelte"
import { get_block_attributes } from "$lib/utils/get_mdx_attributes"

export let block: MdxJsxFlowElement

$: attributes = get_block_attributes<{ wide?: boolean }>(block)

</script>
<columns-wrapper class:wide={ attributes.wide }>
    <ScrollbarRegion>
        <columns>
            {#each block.children as child}
                <GenericBlock block={child}/>
            {/each}
        </columns>
    </ScrollbarRegion>
</columns-wrapper>
<style>

columns-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    &.wide {
        max-width: 1400px;
    }
}

columns {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 24px;
    width: 100%;
}

</style>