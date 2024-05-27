<script lang="ts">
import { get_plain_text } from "$lib/utils/plain_text"
import type { Heading } from "mdast"
import PhrasingContent from "./PhrasingContentArray.svelte"
import { page } from "$app/stores"
import { browser } from "$app/environment"
import Icon from "$lib/display/Icon.svelte"
import Link from "svelte-material-icons/Link.svelte"

export let block: Heading
let heading: HTMLElement

let highlight = false
$: plain_text = get_plain_text(block.children)
$: id = plain_text.toLowerCase().replace(/ /g, "-")

$: if(browser && $page.url.hash === "#" + id) {
    highlight = true
    setTimeout(() => {
        highlight = false
    }, 1000)
    if (heading) heading.scrollIntoView()
}

function copy_link() {
    navigator.clipboard.writeText(`#${id}`)
    window.location.hash = "#" + id
    $page.data.alerts.create_alert("success", "Link copied to clipboard")
}
</script>
<svelte:element
    this={ "h" + block.depth }
    bind:this={ heading }
    {id}
    class="heading"
    class:highlight
    role="button"
    tabindex="0"
    on:click={ copy_link }>
    <content>
        <PhrasingContent children={block.children}/>
    </content>
    <link-selector>
        <Icon
            --size="20px"
            icon={Link}/>
    </link-selector>
</svelte:element>
<style>

link-selector {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 0.8em;
    color: rgba(var(--foreground-rgb), 0.5);
    padding-right: 8px;
}

.heading {
    /* animate the heading background color */
    transition: background-color 0.5s ease-out;
    scroll-margin-top: 10vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* border-radius: 6px; */
    /* margin: none -6px; */
    margin-top: 0.5em;
    cursor: pointer;
    &:hover {
        background: rgba(var(--brand-rgb), 0.1);
        & link-selector {
            color: rgba(var(--foreground-rgb), 0.8);
        }
    }
    & a {
        color: inherit;
        outline: none;
    }
}
.highlight {
    background: rgba(var(--brand-rgb), 0.3);
    /* outline: 2px solid rgba(var(--brand-rgb), 0.5);
    outline-offset: 4px; */
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