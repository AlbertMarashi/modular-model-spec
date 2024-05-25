<script lang="ts">
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import BlocksArray from "./BlocksArray.svelte"
import type { Code } from "mdast"
import Icon from "$lib/display/Icon.svelte"
import Check from "svelte-material-icons/Check.svelte"
import Close from "svelte-material-icons/Close.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import Pause from "svelte-material-icons/Pause.svelte"
import type { Message } from "$lib/types/messages"
import Robot from "svelte-material-icons/Robot.svelte"
import CodeBraces from "svelte-material-icons/CodeBraces.svelte"
import Web from "svelte-material-icons/Web.svelte"
import HammerScrewdriver from "svelte-material-icons/HammerScrewdriver.svelte"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"

export let block: MdxJsxFlowElement

// reduce the attributes array into a single object
$: attributes = block.attributes.reduce((acc, attr) => {
    if (attr.type !== "mdxJsxAttribute") return acc
    if (attr.value === null || attr.value === undefined) return acc
    if (typeof attr.value !== "string") {
        acc[attr.name] = JSON.parse(attr.value.value)
    } else {
        acc[attr.name] = attr.value
    }
    return acc
}, {} as Record<string, string>) as unknown as Message

$: first_code_block = block.children.find(child => child.type === "code") as Code
$: lang = first_code_block.lang

const icons = {
    "assistant": Robot,
    "developer": CodeBraces,
    "platform": Web,
    "context": HammerScrewdriver,
    "user": AccountCircle
}

</script>
<message
    class:assistant={ attributes.role === "assistant" }
    class:context={ attributes.role === "context" }
    class:correct={ "correct" in attributes && attributes.correct === true }
    class:developer={ attributes.role === "developer" }
    class:incorrect={ "correct" in attributes && attributes.correct === false }
    class:platform={ attributes.role === "platform" }
    class:user={ attributes.role === "user" }>
    <name>
        {#if "correct" in attributes}
            <icon-wrapper>
                <Icon icon={attributes.correct === true ? Check : Close}/>
            </icon-wrapper>
        {/if}
        <Icon icon={icons[attributes.role]}/>
        <!-- <MarkdownRenderer markdown={`"role": "${attributes.role}"`}/> -->
        <code class="role">
            { attributes.role }
        </code>
        {#if attributes.role === "assistant"}
            <format> -&gt;&gt;</format>
            <code>{ lang || "unspecified" }</code>
        {/if}
    </name>
    <BlocksArray blocks={block.children}/>
    {#if "end_turn" in attributes && attributes.end_turn === true}
        <format>
            <code>
                <Icon
                    icon={ExitToApp}
                    size="16px"/>
                end_turn
            </code>
        </format>
    {/if}
    {#if "halted_on_completion" in attributes && attributes.halted_on_completion === true}
        <format class="halted">
            <code>
                <Icon
                    icon={Pause}
                    size="16px"/>
                System Halted Model
            </code>
        </format>
    {/if}
</message>
<style>

code {
    font-family: "Fira Code", monospace;
    font-size: 14px;
    font-weight: bold;
    background: rgba(var(--color-rgb), 0.2);
    border-radius: 4px;
    padding: 0 4px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
}

icon-wrapper {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border-radius: 50px;
    background: rgba(var(--color-rgb), 0.3);
}

message {
    padding: 8px;
    background: rgba(var(--color-rgb), 0.08);
    border: 1px solid rgba(var(--color-rgb), 0.1);
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
    &.assistant {
        --color-rgb: var(--foreground-rgb);
        &.correct {
            --color-rgb: var(--green-rgb);
        }
        &.incorrect {
            --color-rgb: var(--red-rgb);
        }
    }
    &.developer {
        --color-rgb: var(--blue-rgb);
    }
    &.platform {
        --color-rgb: var(--purple-rgb);
    }
    &.context {
        --color-rgb: var(--yellow-rgb);
    }
    &.user {
        --color-rgb: var(--foreground-rgb);
        background: rgba(var(--foreground-rgb), 0.04);
        border-color: rgba(var(--foreground-rgb), 0.05);
    }
    & name {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: bold;
        font-size: 16px;
        color: color-mix(in srgb, rgba(var(--color-rgb)) 40%, var(--foreground));
    }

    & format {
        display: flex;
        font-family: "Fira Code", monospace;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: color-mix(in srgb, rgba(var(--color-rgb)) 60%, var(--foreground));
        &.halted {
            --color-rgb: var(--purple-rgb);
        }
    }
}
</style>