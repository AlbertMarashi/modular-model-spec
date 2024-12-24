<script
    lang="ts">
import { browser } from "$app/environment"
import { generate_ast } from "$lib/utils/ast"
import { get_plain_text } from "$lib/utils/plain_text"
import { onDestroy, onMount, tick } from "svelte"
import TocSection from "./TocSection.svelte"
import type { BlockContent, Heading, Root } from "mdast"
import type PhrasingContent from "./markdown-blocks/PhrasingContent.svelte"

export let markdown: string
let active_id: null | string = null
let scrollable_viewport: HTMLElement
export let content: HTMLElement

$: ast = generate_ast(markdown)
$: headings = get_headings(ast)

function get_headings(block: BlockContent | PhrasingContent | Root): Heading[] {
    if (block.type === "heading") return [block]
    if ("children" in block) {
        return block.children.flatMap(get_headings)
    }
    return []
}


// We want to observe the scroll position of the page and update the active
// To do this, we need an array of all the headings on the page, and their
// corresponding ids. We can then use the scroll position to determine which is nearest
// to the top of the scrollable viewport, and set the active id to that heading's id
function update_active_id() {
    // get all the headings within the #content div
    let headings = Array.from(content.querySelectorAll("h1, h2, h3, h4, h5, h6")) as HTMLElement[]

    // get the scroll position of the nearest scrollable parent
    let scroll_position = scrollable_viewport.scrollTop

    if (headings.length === 0) {
        active_id = null
        return
    }

    // find the heading nearest to the top of the page
    headings.sort((a, b) => {
        let a_distance = Math.abs(a.offsetTop - scroll_position - 40)
        let b_distance = Math.abs(b.offsetTop - scroll_position - 40)
        return a_distance - b_distance
    })

    // set the active id to the id of the nearest heading
    active_id = headings[0].id

}

onMount(async () => {
    await tick()
    active_id = headings[0] ? get_plain_text(headings[0].children).toLowerCase().replace(/ /g, "-") : null
    if (browser) {
        scrollable_viewport = content as HTMLElement
        // find the nearest scrollable parent
        while (scrollable_viewport && scrollable_viewport.scrollHeight <= scrollable_viewport.clientHeight) {
            scrollable_viewport = scrollable_viewport.parentElement as HTMLElement
        }

        if (!scrollable_viewport) return

        // update the active id when the page is scrolled
        scrollable_viewport.addEventListener("scroll", update_active_id, { passive: true })
        // update the active id when the page is loaded
        update_active_id()
    }
})

onDestroy(() => {
    if (browser) {
        if (!scrollable_viewport) return
        scrollable_viewport.removeEventListener("scroll", update_active_id)
    }
})

</script>
<div
    class="toc">
    {#each headings as heading}
        <TocSection
            heading={heading}
            bind:active_id={ active_id }/>
    {/each}
</div>
<style>
.toc {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 10px;
}
</style>