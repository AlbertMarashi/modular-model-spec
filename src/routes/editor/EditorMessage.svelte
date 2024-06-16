<script lang="ts">
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
import Delete from "svelte-material-icons/Delete.svelte"
import CodeEditor from "./CodeEditor.svelte"
import AddMessage from "./AddMessage.svelte"
import { createEventDispatcher } from "svelte"

export let message: Message
export let selected: number
export let index: number

let dispatch = createEventDispatcher<{
    insert_above: void,
    insert_below: void,
    delete: void
}>()

$: lang = message.role === "assistant" ? message.format : "markdown"

const icons = {
    "assistant": Robot,
    "developer": CodeBraces,
    "platform": Web,
    "context": HammerScrewdriver,
    "user": AccountCircle
}

</script>
<message
    class:assistant={ message.role === "assistant" }
    class:context={ message.role === "context" }
    class:correct={ "correct" in message && message.correct === true }
    class:developer={ message.role === "developer" }
    class:incorrect={ "correct" in message && message.correct === false }
    class:platform={ message.role === "platform" }
    class:selected={ selected === index }
    class:user={ message.role === "user" }
    role="presentation"
    on:click={ () => selected = index }>
    {#if index === selected}
        <AddMessage
            position="top"
            on:click={ () =>  dispatch("insert_above") }/>
    {/if}
    <name>
        {#if "correct" in message}
            <icon-wrapper>
                <Icon icon={message.correct === true ? Check : Close}/>
            </icon-wrapper>
        {/if}
        <Icon icon={icons[message.role]}/>
        <!-- <MarkdownRenderer markdown={`"role": "${attributes.role}"`}/> -->
        <code class="role">
            { message.role }
        </code>
        {#if message.role === "assistant"}
            <format>-&gt;&gt;</format>
            <code>{ lang || "unspecified" }</code>
        {/if}

        {#if message.role === "context" && message.name}
            <format> -&gt;&gt;</format>
            <code>{ message.name }</code>
        {/if}
        {#if index === selected}
            <button
                class="delete"
                on:click={ () => dispatch("delete") }>
                <Icon icon={Delete}/>
            </button>
        {/if}
    </name>
    <CodeEditor
        bind:code={ message.content }
        bind:language={ lang }/>
    {#if "end_turn" in message && message.end_turn === true}
        <format>
            <code>
                <Icon
                    --size="16px"
                    icon={ExitToApp}/>
                end_turn
            </code>
        </format>
    {/if}
    {#if "halted_on_completion" in message && message.halted_on_completion === true}
        <format class="halted">
            <code>
                <Icon
                    --size="16px"
                    icon={Pause}/>
                System Halted Model
            </code>
        </format>
    {/if}
    {#if index === selected}
        <AddMessage
            position="bottom"
            on:click={ () =>  dispatch("insert_below") }/>
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

button.delete {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    margin-top: -8px;
    margin-bottom: -8px;
    margin-left:auto;
    background: rgba(var(--red-rgb), 0.15);
    --color: rgba(var(--red-rgb), 0.5);
}

icon-wrapper {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border-radius: 50px;
    background: rgba(var(--color-rgb), 0.3);
}

message {
    padding: 12px;
    position: relative;
    background: rgba(var(--color-rgb), 0.08);
    border: 1px solid rgba(var(--color-rgb), 0.1);
    /* border: 2px solid transparent; */
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
    &.selected {
        outline: 2px solid rgba(var(--color-rgb), 0.2);
        outline-offset: 7px;
    }
    &.assistant {
        --color-rgb: var(--teal-rgb);
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