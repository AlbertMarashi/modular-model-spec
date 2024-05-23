<script lang="ts">
import type { MdxJsxFlowElement } from "mdast-util-mdx"
import Unsupported from "./Unsupported.svelte"
import Thread from "./Thread.svelte"
import SystemBlock from "./SystemBlock.svelte"
import MessageBlock from "./MessageBlock.svelte"
import ColumnsBlock from "./ColumnsBlock.svelte"
import ColumnBlock from "./ColumnBlock.svelte"


export let block: MdxJsxFlowElement

</script>
{#if block.name === "Thread"}
    <Thread {block}/>
{:else if block.name === "SystemConfig"}
    <SystemBlock {block}/>
{:else if block.name === "Message"}
    <MessageBlock {block}/>
{:else if block.name === "Columns"}
    <ColumnsBlock {block}/>
{:else if block.name === "Column"}
    <ColumnBlock {block}/>
{:else}
    <Unsupported/>
    <pre>
        { JSON.stringify(block, null, 2) }
    </pre>
{/if}