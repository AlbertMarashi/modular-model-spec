<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import Check from "svelte-material-icons/Check.svelte"
import Close from "svelte-material-icons/Close.svelte"
import ExitToApp from "svelte-material-icons/ExitToApp.svelte"
import Pause from "svelte-material-icons/Pause.svelte"
import type { Message } from "$lib/types/messages"
import Delete from "svelte-material-icons/Delete.svelte"
import CodeEditor from "./CodeEditor.svelte"
import AddMessage from "./AddMessage.svelte"
import CloseCircle from "svelte-material-icons/CloseCircle.svelte"
import { createEventDispatcher, type ComponentProps } from "svelte"
import Toggle from "$lib/controls/Toggle.svelte"
import type AllowedAssistantFormat from "./AllowedAssistantFormat.svelte"
import { icons } from "./editor_types"

export let message: Message
export let selected: number | null | "config"
export let index: number
export let formats: ComponentProps<AllowedAssistantFormat>["format"][]

let dispatch = createEventDispatcher<{
    insert_above: void,
    insert_below: void,
    delete: void
}>()

$: lang = message.role === "assistant" ? message.format : "markdown"

$: format = message.role === "assistant" ? formats.find(f => f.name === message.format) : null



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
    on:focusin={ () => selected = index }
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
        <code class="role">
            { message.role }
        </code>
        {#if message.role === "assistant"}
            <format>-&gt;&gt;</format>
            <input
                class="code"
                size={message.format.length - 1 || 1}
                bind:value={ message.format }/>

            {#if !format}
                <format class="error">
                    -&gt;&gt;
                    <code>
                        <Icon
                            --size="16px"
                            icon={CloseCircle}/>
                        Used unspecified format
                    </code>
                </format>
            {/if}
        {/if}

        {#if message.role === "context" && message.name !== null}
            <format> -&gt;&gt;</format>
            <input
                class="code"
                size={message.name.length - 1 || 1}
                bind:value={ message.name }/>
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
    {#if message.role === "assistant" && (message.end_turn === true || selected === index)}
        <format>
            <code>
                <Icon
                    --size="16px"
                    icon={ExitToApp}/>
                end_turn
            </code>
            {#if selected === index}
                <Toggle bind:value={ message.end_turn }/>
            {/if}
        </format>
    {/if}
    {#if message.role === "assistant" && format && format.halt_on_completion === true}
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
code, .code {
    font-family: "Fira Code", monospace;
    font-size: 14px;
    font-weight: bold;
    color: inherit;
    background: rgba(var(--color-rgb), 0.2);
    border-radius: 4px;
    padding: 2px 4px;
    display: inline-flex;
    align-items: center;
    border: 0;
    appearance: none;
    font-size-adjust: 0.5;
    min-height: 0;
    line-height: 100%;
    gap: 2px;
    &.code {
        padding: 0 4px;
    }
    &:focus {
        outline: 2px solid rgba(var(--color-rgb), 0.3);
    }
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
    &:hover, &:focus {
        background: rgba(var(--red-rgb), 0.3);
    }
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
        min-height: 20px;
        color: color-mix(in srgb, rgba(var(--color-rgb)) 60%, var(--foreground));
        &.halted {
            --color-rgb: var(--purple-rgb);
        }
    }
}
.error {
    --color-rgb: var(--red-rgb);
}
</style>