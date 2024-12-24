<script
    lang="ts">
import type { ComponentType } from "svelte"

export let icon: ComponentType
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="icon"
    on:click
    on:keypress>
    <svelte:component
        this={ icon }/>
</div>
<style>

.icon {
    display: inline-flex;
    color: var(--color);
    font-size: var(--size);
    opacity: var(--opacity);
}
</style>