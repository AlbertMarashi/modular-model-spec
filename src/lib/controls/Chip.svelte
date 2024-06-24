<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import type { ComponentType } from "svelte"
export let right_icon: ComponentType | undefined = undefined
export let left_icon: ComponentType | undefined = undefined
export let label: string | undefined = undefined
export let disabled: boolean = false
export let interactive: boolean = true
export let style: "tonal" | "translucent" | "outline" | "filled" = "outline"
export let small: boolean = false
</script>

<button
    class:disabled
    class:filled={ style === "filled" }
    class:interactive
    class:outline={ style === "outline" }
    class:small
    class:tonal={ style === "tonal" }
    class:translucent={ style === "translucent" }
    {disabled}
    on:click>
    {#if left_icon}
        <Icon
            --color="var(--left-icon-color)"
            icon={left_icon}/>
    {/if}
    <span>{ label }</span>
    {#if right_icon}
        <Icon
            --color="var(--right-icon-color)"
            icon={right_icon}/>
    {/if}
</button>
<style>

button {
    display: flex;
    /* background: rgba(var(--foreground-rgb), 0.04);
    color: rgb(var(--foreground-rgb));
    border: 1px solid var(--foreground-rgb); */
    border-radius: 8px;
    align-items: center;
    transition: background-color 0.1s, border-color 0.1s;
    padding: 0 8px;
    min-height: 32px;
    cursor: default;
    font-size: 16px;
    --color: var(--brand-text);
    --size: 18px;
    font-weight: 600;
    &:not(.disabled) {
        outline: none;
            &.interactive {
                cursor: pointer;
                &:hover {
                background-color: rgba(var(--foreground-rgb), 0.08);
            }
            &:active, &:focus {
                background-color: rgba(var(--foreground-rgb), 0.16);
            }
        }
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
            background: rgba(var(--brand-rgb), 0.2);
            color: rgba(var(--foreground-rgb), 0.8);

            &:hover, &:focus {
                color: rgba(var(--foreground-rgb), 1);
                background: rgba(var(--brand-rgb), 0.3);
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

        &.translucent {
            background: rgba(var(--foreground-rgb), 0.06);
            color: rgba(var(--foreground-rgb), 0.8);

            &:hover, &:focus {
                color: rgba(var(--foreground-rgb), 1);
                background: rgba(var(--foreground-rgb), 0.2);
            }

            &:active {
                color: rgba(var(--foreground-rgb), 1);
                background: rgba(var(--foreground-rgb), 0.3);
            }
        }

    }

    &.disabled {
        opacity: 0.55;
        border: 1px solid rgba(var(--foreground-rgb), 0.5);
        --color: rgba(var(--foreground-rgb), 0.5);
        cursor: not-allowed;
    }
    & span {
        padding: 0 8px;
        font-size: 14px;
    }
    &.small {
        padding: 0 4px;
        min-height: 28px;
        --size: 16px;
        & span {
            padding: 0 6px;
            font-size: 14px;
        }
    }
}

</style>