<script lang="ts">
import { browser } from "$app/environment"
import { get_plain_text } from "$lib/utils/plain_text"
import type { Heading } from "mdast"

export let heading: Heading
export let active_id: string | null
let toc_heading: HTMLElement

$: plain_text = get_plain_text(heading.children)
$: id = plain_text.toLowerCase().replace(/ /g, "-")

$: active = active_id === id

$: if(browser && active) {
    toc_heading.scrollIntoView({ behavior: "smooth", block: "nearest"})
}

</script>
<a
    bind:this={ toc_heading }
    style:padding-left="{ heading.depth * 10 }px"
    class="toc-section"
    class:active
    href="#{id}">
    { plain_text }
</a>
<style>

.toc-section {
    color: rgba(var(--foreground-rgb), 0.8);
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 14px;
    line-height: 1.8em;
    font-weight: 700;
    display: flex;
    width: 100%;
    &:hover {
        background-color: rgba(var(--foreground-rgb), 0.1);
        color: var(--foreground);
    }
    &.active {
        background-color: rgba(var(--brand-rgb), 0.1);
        color: var(--brand);
    }
}
</style>