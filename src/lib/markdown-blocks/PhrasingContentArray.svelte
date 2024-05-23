<script lang="ts">
import type { PhrasingContent } from "mdast"
import PhrasingContentComponent from "./PhrasingContent.svelte"

export let children: PhrasingContent[]
</script>
{#each children as block}
    <PhrasingContentComponent {block}/>
{/each}