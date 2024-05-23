<script lang="ts">
import MarkdownRenderer from "$lib/MarkdownRenderer.svelte"
import ScrollbarRegion from "$lib/ScrollbarRegion.svelte"
import TableOfContents from "$lib/TableOfContents.svelte"

export let data
export let content: HTMLElement

// $: texts = data.ast.children.filter(child => child.type === "text" && "value" in child && typeof child.value === "string") as unknown as { value: string }[]
// $: raw_spec = texts.map(child => child.value).join("\n")
// $: console.log(spec)
</script>
<page>
    <toc>
        <h2>Table of Contents</h2>
        <toc-contents>
            <ScrollbarRegion>
                <TableOfContents
                    content={content}
                    markdown={data.spec}/>
            </ScrollbarRegion>
        </toc-contents>
    </toc>
    <spec bind:this={ content }>
        <MarkdownRenderer markdown={data.spec}/>
        <!-- {#each data.ast.children as child}
            {#if child.type === "text" && "value" in child && typeof child.value === "string"}
                <MarkdownRenderer markdown={child.value}/>
            {:else}
                svelte component
            {/if}
        {/each} -->
    </spec>
</page>
<style>
spec {
    display: flex;
    flex-direction: column;
    padding: 40px;
    max-height: 100%;
    overflow: auto;
    flex: 1;
}

toc {
    border-right: 1px solid rgba(var(--foreground-rgb), 0.1);
    max-height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    flex: 1;
    & h2 {
        padding: 16px;
        font-size: 1.2em;
        border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
    }

    & toc-contents {
        overflow: auto;
        max-height: 100%;
        flex: 1;
    }
}

page {
    display: flex;
    flex-direction: row;
    max-height: 100%;
    overflow: hidden;
}
</style>