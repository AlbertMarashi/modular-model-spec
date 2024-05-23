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
    color: rgba(var(--foreground-rgb), 0.8)
}
</style>