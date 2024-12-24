<script
    lang="ts">
import SystemBlock from "./SystemBlock.svelte"
import MessageBlock from "./MessageBlock.svelte"
import Unsupported from "./Unsupported.svelte"
import GenericBlock from "./GenericBlock.svelte"
import Icon from "$lib/display/Icon.svelte"
import Forum from "svelte-material-icons/Forum.svelte"
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import ColumnsBlock from "./ColumnsBlock.svelte"
import Toggle from "$lib/controls/Toggle.svelte"
import type { Message, Thread } from "$lib/types/messages"
import type { BlockContent, Code } from "mdast"
import JsonMessageRenderer from "./JSONMessageRenderer.svelte"

export let block: MdxJsxFlowElement

let json_mode = false
let thread = get_message_json(block)

function get_message_json(block: MdxJsxFlowElement): Thread {
    const messages: Thread = []

    for (const child of block.children) {
        if (child.type === "mdxJsxFlowElement") {
            if (child.name === "SystemConfig") {
            // const code = get_first_code_block_value(child)
                // messages.push(child)
            } else if (child.name === "Message") {
                messages.push( get_message_attributes(child))
            } else if (child.name === "Columns") {
                messages.push(get_message_json(child))
            } else if (child.name === "Column") {
                messages.push(get_message_json(child))
            }
        }
    }

    return messages
}

function get_message_attributes (block: MdxJsxFlowElement): Message {
    const attributes: Record<string, string | null> = {
        role: null,
        format: null,
        content: null,
        end_turn: null,
    }

    const code = get_first_code_block(block)

    if (code) attributes.content = code.value


    for (const attr of block.attributes) {
        if (attr.type !== "mdxJsxAttribute") continue
        if (attr.value === null || attr.value === undefined) continue
        if (attributes[attr.name] !== null) continue
        if (typeof attr.value !== "string") {
            attributes[attr.name] = JSON.parse(attr.value.value)
        } else {
            attributes[attr.name] = attr.value
        }
    }


    if (code?.lang && attributes.role === "assistant") attributes.format = code.lang

    // remove all null keys
    for (const key in attributes) {
        if (attributes[key] === null) {
            delete attributes[key]
        }
    }

    return attributes as Message
}

function get_first_code_block(block: BlockContent): Code | null {
    if (!("children" in block)) return null
    for (const child of block.children) {
        if (child.type === "code" && block.type === "mdxJsxFlowElement") {
            return child
        } else if ("children" in child) {
            const code = get_first_code_block(child as BlockContent)
            if (code) {
                return code
            }
        }
    }
    return null
}
</script>
<div
    class="thread">
    <inner>
        <section-heading>
            <Icon
                icon={Forum}/>
            Thread
            <div
                class="toggler">
                JSON
                <Toggle
                    bind:value={ json_mode }/>
            </div>
        </section-heading>
        <messages>
            {#if json_mode}
                <JsonMessageRenderer
                    thread={thread}/>
            {:else}
                {#each block.children as child}
                    {#if child.type === "mdxJsxFlowElement"}
                        {#if child.name === "SystemConfig"}
                            <SystemBlock
                                block={child}/>
                        {:else if child.name === "Message"}
                            <MessageBlock
                                block={child}/>
                        {:else if child.name === "Columns"}
                            <ColumnsBlock
                                block={child}/>
                        {:else}
                            <Unsupported/>
                        {/if}
                    {:else}
                        <GenericBlock
                            block={child}/>
                    {/if}
                {/each}
            {/if}
        </messages>
    </inner>
</div>
<style>

.toggler {
    display: flex;
    justify-content: end;
    flex: 1;
    align-items: center;
    gap: 8px;
}

inner {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    background: rgba(var(--foreground-rgb), 0.02);
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
}


.thread.thread {
    max-width: 100%;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    width: 100%;
    & section-heading {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-left: 16px;
        padding-top: 16px;
        padding-right: 16px;
        padding-bottom: 0;
        color: rgba(var(--foreground-rgb), 1);
        font-weight: bold;
        font-size: 16px;
        font-family: "Fira Code", monospace;
    }

    & messages {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        border-radius: 8px;
    }
}
</style>