<script
    generics="X extends string"
    lang="ts">
import Chip from "./Chip.svelte"
import type { ComponentType } from "svelte"

// TODO: REMOVE WHEN https://github.com/sveltejs/svelte-eslint-parser/issues/306 IS FIXED
// eslint-disable-next-line no-undef
type T = X | string

export let value: T
export let buttons: Array<{ left_icon?: ComponentType, label?: string, value: T }>

</script>
<chips>
    {#each buttons as button}
        <Chip
            style={value === button.value ? "tonal" : "translucent"}
            label={button.label ?? button.value}
            left_icon={value === button.value ? button.left_icon : undefined}
            on:click={ () => value = button.value }/>
    {/each}
</chips>
<style>

chips {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    max-width: max-content;
    gap: 8px;
    width: 100%;
}

</style>