

<script lang="ts">
import AllowedAssistantFormat from "./AllowedAssistantFormat.svelte"
import type { Thread } from "./editor_types"
import Chip from "$lib/display/Chip.svelte"
import Icon from "$lib/display/Icon.svelte"
import CodeTags from "svelte-material-icons/CodeTags.svelte"

export let selected: number | null | "config"
export let formats: Thread["allowed_formats"]

function add_format() {
    formats.push({
        name: "edit_name",
        halt_on_start: false,
        halt_on_completion: false,
        sampler: null,
    })
    formats = formats
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
    {#each formats as format}
        <AllowedAssistantFormat
            selected={selected === "config"}
            bind:format/>
    {/each}
    {#if selected === "config"}
        <Chip
            label="Add format"
            on:click={ add_format }/>
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