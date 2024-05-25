<script lang="ts">
import type { Paragraph } from "mdast"
import PhrasingContentArray from "./PhrasingContentArray.svelte"

export let block: Paragraph

</script>
<p>
    <PhrasingContentArray children={block.children}/>
</p>
<style>
p {
    margin: 0;
    width: 100%;
    color: color-mix(in srgb, rgba(var(--color-rgb, var(--background-rgb))) 15%, var(--foreground));
}
</style>