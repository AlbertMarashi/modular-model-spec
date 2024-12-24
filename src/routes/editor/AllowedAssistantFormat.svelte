<script
    lang="ts">
import Toggle from "$lib/controls/Toggle.svelte"
import Icon from "$lib/display/Icon.svelte"
import Pause from "svelte-material-icons/Pause.svelte"

export let selected: boolean
export let format: {
    name: string
    halt_on_completion: boolean
// halt_on_start: boolean
    // sampler: "json" | null
}

</script>
<allowed-format>
    <format>
        <input
            class="code"
            size={format.name.length - 1 || 1}
            bind:value={ format.name }/>
        -&gt;&gt;
        <code>
            <Icon
                --size="16px"
                icon={Pause}/>
            Halt on completion
        </code>
        {#if selected}
            <Toggle
                bind:value={ format.halt_on_completion }/>
        {/if}
    </format>
</allowed-format>
<style>
allowed-format {
    display: flex;
    flex-direction: column;
    gap: 8px;
    --color-rgb: var(--foreground-rgb);
    /* background: rgba(var(--color-rgb), 0.05); */
    /* border-radius: 4px; */
    /* padding: 8px; */
}

code, .code {
    font-family: "Fira Code", monospace;
    font-size: 14px;
    font-weight: bold;
    color: inherit;
    background: rgba(var(--color-rgb), 0.1);
    border-radius: 4px;
    padding: 0 4px;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    &:focus {
        outline: 2px solid rgba(var(--color-rgb), 0.2);
    }
}

format {
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
</style>