<script lang="ts">
import { get_plain_text } from "$lib/utils/plain_text"
import type { Heading } from "mdast"
import PhrasingContent from "./PhrasingContentArray.svelte"
import { page } from "$app/stores"

export let block: Heading

let highlight = false
$: plain_text = get_plain_text(block.children)
$: id = plain_text.toLowerCase().replace(/ /g, "-")

$: highlight = $page.url.hash === "#" + id
</script>
<svelte:element
    this={ "h" + block.depth }
    {id}
    class="heading"
    class:highlight>
    <PhrasingContent children={block.children}/>
</svelte:element>
<style>

.heading {
    /* animate the heading background color */
    transition: background-color 0.5s ease-out;
}
.highlight {
    /* background: rgba(var(--brand-rgb), 0.3); */
    outline: 2px solid rgba(var(--brand-rgb), 0.5);
    outline-offset: 4px;
    border-radius: 4px;
}
h1 {
    font-size: 2.5em;
    border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    width: 100%;
}
h2 {
    font-size: 2em;
}
h3 {
    font-size: 1.5em;
}
h4 {
    font-size: 1.25em;
}
h5 {
    font-size: 1.125em;
}
h6 {
    font-size: 1em;
}
</style>