<script
    lang="ts">
import MarkdownRenderer from "$lib/MarkdownRenderer.svelte"
import PageHead from "$lib/PageHead.svelte"
import TableOfContents from "$lib/TableOfContents.svelte"

export let data
export let content: HTMLElement

</script>
<PageHead
    description={"A new specification to make large language models more reliable, powerful and flexible."}
    include_suffix={false}
    title={"Modular Model Spec"}/>
<page>
    <toc>
        <toc-contents>
            <h2>Table of Contents</h2>
            <TableOfContents
                content={content}
                markdown={data.spec}/>
        </toc-contents>
    </toc>
    <spec
        bind:this={ content }>
        <MarkdownRenderer
            markdown={data.spec}/>
    </spec>
</page>
<style>
spec {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    padding: 40px;
    overflow-y: auto;
    scrollbar-color: rgba(var(--foreground-rgb), 0.1) rgba(var(--foreground-rgb), 0.01);
    /* flex: 1; */
}

toc {
    max-height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 350px;
    
    & h2 {
        padding: 16px;
        font-size: 1.2em;
        opacity: 0.7;
        font-weight: 200;
        /* border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1); */
    }

    & toc-contents {
        overflow: auto;
        scrollbar-color: rgba(var(--foreground-rgb), 0.1) rgba(var(--foreground-rgb), 0.0);
        max-height: 100%;
        flex: 1;
    }
}

page {
    display: flex;
    flex-direction: row;
    max-height: 100%;
    overflow: hidden;
    @media (max-width: 1000px) {
        & toc {
            display: none;
        }
    }
}
</style>