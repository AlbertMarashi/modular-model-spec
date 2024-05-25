<script lang="ts">
import GenericBlock from "./GenericBlock.svelte"
import type { RootContent } from "mdast"

export let blocks: RootContent[]
export let list: boolean = false
export let give_max_width: boolean = false
</script>

<div
    class="blocks-array"
    class:give_max_width
    class:list>
    {#each blocks as block}
        <GenericBlock {block}/>
    {/each}
</div>

<style>
.blocks-array {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    line-height: 1.5;
    width: 100%;
    align-items: flex-start;
    text-align: inherit;
    &.list {
        gap: 0.4rem;
    }
}
.give_max_width > :global(*) {
    max-width: 800px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
</style>