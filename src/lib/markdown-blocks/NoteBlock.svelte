<script lang="ts">
import Callout from "$lib/display/Callout.svelte"
import type { ContainerDirective } from "mdast-util-directive"
import BlocksArray from "./BlocksArray.svelte"

export let block: ContainerDirective

const mapping: Record<string, string> = {
    warning: "warning",
    error: "error",
    note: "note",
    tip: "success",
}

$: type = mapping[block.name]
</script>
<Callout type={type}>
    <BlocksArray blocks={block.children}/>
</Callout>
