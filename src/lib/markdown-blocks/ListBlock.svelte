<script
    lang="ts">
import type { List } from "mdast"
import ListItemBlock from "./ListItemBlock.svelte"


export let block: List

$: tag = block.ordered ? "ol" : "ul"
</script>
<svelte:element
    this={ tag }>
    {#each block.children as child}
        <ListItemBlock
            block={child}/>
    {/each}
</svelte:element>
<style>
ol, ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4em;
}
</style>