

<script lang="ts">
import AllowedAssistantFormat from "./AllowedAssistantFormat.svelte"
import type { Thread } from "./editor_types"
import Chip from "$lib/controls/Chip.svelte"
import Icon from "$lib/display/Icon.svelte"
import CodeTags from "svelte-material-icons/CodeTags.svelte"
import AddMessage from "./AddMessage.svelte"

export let selected: number | null | "config"
export let thread: Thread

function add_format() {
    thread.allowed_formats.push({
        name: "edit_name",
        // halt_on_start: false,
        halt_on_completion: false,
    // sampler: null,
    })
    thread.allowed_formats = thread.allowed_formats
}

function add_message() {
    thread.messages.unshift(null)
    thread.messages = thread.messages
}
</script>
<system-config
    class:selected={ selected === "config" }
    role="presentation"
    on:click={ () => selected = "config" }
    on:focusin={ () => selected = "config" }>
    <system-heading>
        <Icon
            --color="gray"
            icon={CodeTags}/>
        System Settings
    </system-heading>
    {#each thread.allowed_formats as format}
        <AllowedAssistantFormat
            selected={selected === "config"}
            bind:format/>
    {/each}
    {#if selected === "config"}
        <Chip
            style="translucent"
            label="Add format"
            on:click={ add_format }/>
    {/if}
    {#if selected === "config"}
        <AddMessage
            position="bottom"
            on:click={ add_message }/>
    {/if}
</system-config>

<style>
system-heading {
    font-weight: bold;
    font-size: 14px;
    font-family: "Fira Code", monospace;
}

system-config {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: start;
    gap: 12px;
    --color-rgb: var(--foreground-rgb);
    background: rgba(var(--color-rgb), 0.05);
    border: 1px solid rgba(var(--color-rgb), 0.05);
    border-radius: 12px;
    padding: 12px;
    &.selected {
        outline: 2px solid rgba(var(--color-rgb), 0.2);
        outline-offset: 7px;
    }
}

</style>