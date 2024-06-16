
<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import Add from "svelte-material-icons/Plus.svelte"

export let position: "top" | "bottom"
</script>
<wrapper
    class:bottom={ position === "bottom" }
    class:top={ position === "top" }>
    <button on:click|stopPropagation>
        <Icon icon={Add}/>
    </button>
</wrapper>

<style>

wrapper {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    height: 0;
    z-index: 2;
    justify-content: center;
    &.top {
        top: -8px;
    }
    &.bottom {
        bottom: -9px;
    }
    /* background: rgba(var(--foreground-rgb), 0.1); */
}

button {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, rgba(var(--color-rgb)) 5%, var(--background));
    border: 2px solid rgba(var(--color-rgb), 0.15);
    padding: 8px 12px;
    border-radius: 50px;
    align-self: center;
}

</style>