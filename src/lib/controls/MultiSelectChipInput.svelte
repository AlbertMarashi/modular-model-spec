<script
    generics="X extends string"
    lang="ts">
import FlexWrap from "$lib/display/FlexWrap.svelte"

import Chip from "$lib/controls/Chip.svelte"
import Check from "svelte-material-icons/Check.svelte"
import type { ComponentType } from "svelte"

// TODO: REMOVE WHEN https://github.com/sveltejs/svelte-eslint-parser/issues/306 IS FIXED
// eslint-disable-next-line no-undef
type T = X | string

export let values: Array<T>
export let buttons: Array<{ left_icon?: ComponentType, label?: string, value: T }>

</script>
<FlexWrap>
    {#each buttons as button}
        <Chip
            style={values.find(v => v === button.value) ? "tonal" : "outline"}
            left_icon={values.find(v => v === button.value) === button.value ? button.left_icon || Check : undefined}
            on:click={ () => {
                if (values.find(v => v === button.value)) {
                    values = values.filter(v => v !== button.value)
                } else {
                    values = [...values, button.value]
                }
            } }
            bind:label={ button.label }/>
    {/each}
</FlexWrap>
