<script
    lang="ts">
import Unsupported from "./Unsupported.svelte"
import ParagraphBlock from "./ParagraphBlock.svelte"
import HeadingBlock from "./HeadingBlock.svelte"
import ContainerDirective from "./ContainerDirective.svelte"
import ListBlock from "./ListBlock.svelte"
import BlockQuoteBlock from "./BlockQuoteBlock.svelte"
import CodeBlock from "./CodeBlock.svelte"
import TableBlock from "./TableBlock.svelte"
import type { RootContent } from "mdast"
import MdxComponent from "./MdxComponent.svelte"

export let block: RootContent

</script>
{#if block.type === "paragraph"}
    <ParagraphBlock
        {block}/>
{:else if block.type === "heading"}
    <HeadingBlock
        {block}/>
{:else if block.type === "containerDirective"}
    <ContainerDirective
        {block}/>
{:else if block.type === "list"}
    <ListBlock
        {block}/>
{:else if block.type === "blockquote"}
    <BlockQuoteBlock
        {block}/>
{:else if block.type === "code"}
    <CodeBlock
        code={block.value}
        language={block.lang}/>
{:else if block.type === "table"}
    <TableBlock
        {block}/>
{:else if block.type === "leafDirective"}
    <Unsupported/>
{:else if block.type === "thematicBreak"}
    <hr/>
{:else if block.type === "mdxJsxFlowElement"}
    <MdxComponent
        {block}/>
{:else}
    <Unsupported/>
    <pre>
        { JSON.stringify(block, null, 2) }
    </pre>
{/if}