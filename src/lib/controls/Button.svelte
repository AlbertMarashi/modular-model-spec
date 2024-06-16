<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import type { ComponentType } from "svelte"

export let right_icon: ComponentType | undefined = undefined
export let left_icon: ComponentType | undefined = undefined
export let label: string | undefined = undefined
export let disabled: boolean = false
export let type: "filled" | "tonal" |  "outlined" | "transparent"
export let href: string | undefined = undefined
export let expand = false
$: tag = href ? "a" : "button" as "a" | "button"
</script>
<svelte:element
    this={ tag }
    class="button"
    class:disabled
    class:expand
    class:filled={ type === "filled" }
    class:outlined={ type === "outlined" }
    class:tonal={ type === "tonal" }
    class:transparent={ type === "transparent" }
    {disabled}
    href={href}
    role="button"
    tabindex="0"
    on:click>
    {#if left_icon}
        <Icon icon={left_icon}/>
    {/if}
    {#if label}
        <span>{ label }</span>
    {/if}
    {#if right_icon}
        <Icon icon={right_icon}/>
    {/if}
</svelte:element>
<style>

.button {
    display: flex;
    color: var(--brand);
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    transition: background-color 0.1s ease-in-out, border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
    padding: 0 16px;
    min-height: 40px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
    --size: 22px;
    &.expand {
        width: 100%;
        flex: 1;
    }

    & span {
        padding: 0 8px;
        line-height: 1.5em;
    }

    &:not(.disabled) {

        &.filled {
            background: var(--brand);
            color: var(--foreground);

            &:hover, &:focus {
                box-shadow: 0 2px 3px -3px rgba(0,0,0,1);
                background: rgba(var(--brand-rgb), 0.8);
            }

            &:active {
                box-shadow: none;
                background: rgba(var(--brand-rgb), 0.7);
            }
        }

        &.tonal {
            background: rgba(var(--foreground-rgb), 0.05);
            color: rgba(var(--foreground-rgb), 0.8);

            &:hover, &:focus {
                color: rgba(var(--foreground-rgb), 1);
                background: rgba(var(--brand-rgb), 0.2);
            }

            &:active {
                color: rgba(var(--foreground-rgb), 1);
                background: rgba(var(--brand-rgb), 0.3);
            }
        }

        &.transparent {
            background: transparent;
            border: none;

            &:hover, &:focus {
                background: rgba(var(--brand-rgb), 0.1);
            }

            &:active {
                background: rgba(var(--brand-rgb), 0.2);
                box-shadow: none;
            }
        }
    }

    &.disabled {
        outline: 1px solid rgba(var(--foreground-rgb), 0.1);
        outline-offset: -1px;
        color: rgba(var(--foreground-rgb), 0.30);
        cursor: default;
    }
}
</style>
