<script lang="ts">
import type { Message } from "$lib/types/messages"
import Icon from "$lib/display/Icon.svelte"
import Robot from "svelte-material-icons/Robot.svelte"
import CodeBraces from "svelte-material-icons/CodeBraces.svelte"
import Web from "svelte-material-icons/Web.svelte"
import HammerScrewdriver from "svelte-material-icons/HammerScrewdriver.svelte"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
import type { ComponentType } from "svelte"
import Delete from "svelte-material-icons/Delete.svelte"
import { createEventDispatcher } from "svelte"

let dispatch = createEventDispatcher<{ delete: void }>()

export let message: Message | null
export let index: number
export let selected: number | null | "config"
export let deletable: boolean = true

let base_messages: Message[] = [
    {
        role: "assistant",
        format: "markdown",
        content: "This is an assistant message",
        end_turn: true,
    },
    {
        role: "developer",
        content: "This is a developer message",
    },
    {
        role: "platform",
        content: "This is a platform message",
    },
    {
        role: "context",
        name: "context_name",
        content: "This is a context message",
    },
    {
        role: "user",
        content: "This is a user message",
    },
]

const icons: Record<typeof base_messages[number]["role"], ComponentType> = {
    "assistant": Robot,
    "developer": CodeBraces,
    "platform": Web,
    "context": HammerScrewdriver,
    "user": AccountCircle
}

</script>
<picker
    class:selected={ selected === index }
    role="presentation"
    on:click={ () => selected = index }>
    <message-type>
        Add a new message
        {#if index === selected && deletable}
            <button
                class="delete"
                on:click={ () => dispatch("delete") }>
                <Icon icon={Delete}/>
            </button>
        {/if}
    </message-type>
    <flex-wrapper>
        {#each base_messages as option}
            <button
                class={option.role}
                class:selected={ selected === index }
                on:click={ () => message = option }>
                <Icon icon={icons[option.role]}/>
                <span>{ option.role }</span>
            </button>
        {/each}
    </flex-wrapper>
</picker>
<style>
picker {
    display: flex;
    flex-direction: column;
    background: rgba(var(--foreground-rgb), 0.02);
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
    padding: 12px;
    gap: 12px;
    &.selected {
        outline: 2px solid rgba(var(--foreground-rgb), 0.2);
        outline-offset: 7px;
    }
}

message-type {
    font-size: 16px;
    font-style: italic;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(var(--foreground-rgb), 0.6);
    display: flex;
    align-items: center;
    gap: 8px;
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

flex-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

button {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    background: rgba(var(--color-rgb), 0.1);
    color: rgba(var(--color-rgb), 0.9);
    border-radius: 8px;
    padding: 4px 8px;
    cursor: pointer;
    &.assistant {
        --color-rgb: var(--teal-rgb);
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
    }
}
</style>