<script lang="ts">
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import BlocksArray from "./BlocksArray.svelte"
import type { Code } from "mdast"
import Icon from "$lib/display/Icon.svelte"
import Check from "svelte-material-icons/Check.svelte"
import Close from "svelte-material-icons/Close.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import Pause from "svelte-material-icons/Pause.svelte"

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

type Message =
    | Assistant
    | Developer
    | Platform
    | User
    | Tool

/* an LLM generated response */
type Assistant = {
    role: "assistant"
    // the response format or recipient of a tool
    format: string
    content: string
    // whether this assistant ended it's turn
    end_turn: boolean,
    correct?: boolean,
    halted_on_completion?: boolean
}

/* An LLM developer instruction */
type Developer = {
    role: "developer"
    content: string
}

/* An instruction provided by the LLM platform or API service */
type Platform = {
    role: "platform"
    content: string
}

/* A end-user provided instruction */
type User = {
    role: "user"
    content: string
}

/**
 * Generated response data from the LLM-augmented system (developer or platform)
 */
type Tool = {
    role: "tool"
    // Data returned from a tool
    content: string
}

const pretty_types = {
    "assistant": "Assistant",
    "developer": "Developer",
    "platform": "Platform",
    "tool": "Tool",
    "user": "User"
}

</script>
<message
    class:assistant={ attributes.role === "assistant" }
    class:correct={ "correct" in attributes && attributes.correct === true }
    class:developer={ attributes.role === "developer" }
    class:incorrect={ "correct" in attributes && attributes.correct === false }
    class:platform={ attributes.role === "platform" }
    class:tool={ attributes.role === "tool" }
    class:user={ attributes.role === "user" }>
    <name>
        {#if "correct" in attributes}
            <icon-wrapper>
                <Icon icon={attributes.correct === true ? Check : Close}/>
            </icon-wrapper>
        {/if}
        { pretty_types[attributes.role] }
        {#if attributes.role === "assistant"}
            <format>
                -&gt;&gt; <code>{ lang || "unspecified" }</code>
            </format>
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

icon-wrapper {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border-radius: 50px;
    background: rgba(var(--color-rgb), 0.3);
}

message {
    padding: 8px;
    background: rgba(var(--color-rgb), 0.1);
    border: 0px solid rgba(var(--color-rgb), 0.3);
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
    &.assistant {
        --color-rgb: var(--purple-rgb);
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
    &.tool {
        --color-rgb: var(--yellow-rgb);
    }
    &.user {
        --color-rgb: var(--foreground-rgb);
        background: rgba(var(--foreground-rgb), 0.03);
        border-color: rgba(var(--foreground-rgb), 0.2);
    }
    & name {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: bold;
        font-size: 16px;
        color: color-mix(in srgb, rgba(var(--color-rgb)) 60%, var(--foreground));
    }

    & format {
        display: flex;
        font-family: "Fira Code", monospace;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: color-mix(in srgb, rgba(var(--color-rgb)) 60%, var(--foreground));
        & code {
            font-size: 14px;
            font-weight: bold;
            background: rgba(var(--color-rgb), 0.2);
            border-radius: 4px;
            padding: 0 4px;
            display: inline-flex;
            align-items: center;
            gap: 2px;
        }
        &.halted {
            --color-rgb: var(--purple-rgb);
        }
    }
}
</style>