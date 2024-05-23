<script lang="ts">
import SystemBlock from "./SystemBlock.svelte"
import MessageBlock from "./MessageBlock.svelte"
import Unsupported from "./Unsupported.svelte"
import GenericBlock from "./GenericBlock.svelte"
import Icon from "$lib/display/Icon.svelte"
import Forum from "svelte-material-icons/Forum.svelte"
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import ColumnsBlock from "./ColumnsBlock.svelte"

export let block: MdxJsxFlowElement

</script>
<div class="thread">
    <section-heading>
        <Icon icon={Forum}/>
        Thread
    </section-heading>
    <messages>
        {#each block.children as child}
            {#if child.type === "mdxJsxFlowElement"}
                {#if child.name === "SystemConfig"}
                    <SystemBlock block={child}/>
                {:else if child.name === "Message"}
                    <MessageBlock block={child}/>
                {:else if child.name === "Columns"}
                    <ColumnsBlock block={child}/>
                {:else}
                    <Unsupported/>
                {/if}
            {:else}
                <GenericBlock block={child}/>
            {/if}
        {/each}
    </messages>
</div>
<style>
.thread {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* border: 2px solid rgba(var(--foreground-rgb), 0.1); */
    border-left: 6px solid rgba(var(--foreground-rgb), 0.25);
    box-shadow: inset 0 0 8px 2px rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    & section-heading {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-left: 16px;
        padding-top: 16px;
        color: rgba(var(--foreground-rgb), 1);
        /* border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1); */
        font-weight: bold;
        font-size: 16px;
        font-family: "Fira Code", monospace;
    }

    & messages {
        /* background: rgba(var(--foreground-rgb), 0.02); */
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
    }
}
</style>