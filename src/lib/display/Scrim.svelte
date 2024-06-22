<script lang="ts">
import { createEventDispatcher } from "svelte"

let dispatch = createEventDispatcher<{ close: void }>()

function handleClickOutside(event: MouseEvent) {
    // Check if the click is outside the slot content
    if (event.target === event.currentTarget) {
        dispatch("close")
    }
}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<screen on:click={ handleClickOutside }>
    <slot/>
</screen>

<style>

screen {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}
</style>