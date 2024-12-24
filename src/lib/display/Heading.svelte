<script
    lang="ts">
import type { ComponentType } from "svelte"
import Icon from "./Icon.svelte"

export let text: string | undefined = undefined
export let left_icon: ComponentType | null = null
export let level: 1 | 2 | 3 | 4 | 5 | 6 = 1

</script>


<heading
    class="level-{level}">
    {#if left_icon}
        <Icon
            icon={left_icon}/>
    {/if}
    <svelte:element
        this={ "h" + level }>
        { text ?? "" }
        <slot/>
    </svelte:element>
</heading>


<style>
heading {
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 600;
    --color: var(--icon-color, var(--brand));
    &.level-1 {
        font-size: var(--size, 32px);
    }
    &.level-2 {
        font-size: var(--size, 28px);
    }
    &.level-3 {
        font-size: var(--size, 24px);
    }
    &.level-4 {
        font-size: var(--size, 20px);
    }
    &.level-5 {
        font-size: var(--size, 18px);
    }
    &.level-6 {
        font-size: var(--size, 16px);
    }
}

h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
    margin: 0;
}

</style>