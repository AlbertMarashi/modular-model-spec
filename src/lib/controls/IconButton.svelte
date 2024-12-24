<script
    lang="ts">
import Icon from "$lib/display/Icon.svelte"
import type { ComponentType } from "svelte"

export let icon: ComponentType
export let disabled: boolean = false
export let type: "filled" | "tonal" |  "outlined" | "transparent"
</script>
<button
    class:disabled={ disabled }
    class:filled={ type === "filled" }
    class:outlined={ type === "outlined" }
    class:tonal={ type === "tonal" }
    class:transparent={ type === "transparent" }
    {disabled}
    on:click>
    <Icon
        {icon}/>
</button>
<style>

    button {
        display: flex;
        color: var(--dark-brand);
        border-radius: 800px;
        align-items: center;
        justify-content: center;
        transition: background-color 0.1s ease-in-out, border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
        padding: 8px;
        width: 40px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        --size: 22px;
        &:not(.disabled) {

            &.filled {
                background: linear-gradient(to right, var(--brand-left), var(--brand-right));
                color: rgba(0, 0, 0, 0.75);

                &:hover {
                    background: linear-gradient(to right, rgba(var(--brand-left-rgb), 0.8), rgba(var(--brand-right-rgb), 0.8));
                    /** use color mix with the variables */
                    background: linear-gradient(
                        to right,
                        color-mix(in srgb, white, var(--brand-left) 90%),
                        color-mix(in srgb, white, var(--brand-right) 90%)
                    );
                }

                &:active {
                    background: linear-gradient(to right, rgba(var(--brand-left-rgb), 0.7), rgba(var(--brand-right-rgb), 0.7));
                    /** use color mix with the variables */
                    background: linear-gradient(
                        to right,
                        color-mix(in srgb, white, var(--brand-left) 80%),
                        color-mix(in srgb, white, var(--brand-right) 80%)
                    );
                }
            }

            &.tonal {
                background: rgba(var(--brand-rgb), 0.2);
                color: var(--brand);

                &:hover {
                    background: rgba(var(--brand-rgb), 0.3);
                    box-shadow: 0 2px 3px -3px rgba(0,0,0,1);
                }

                &:active {
                    background: rgba(var(--brand-rgb), 0.4);
                    box-shadow: none;
                }
            }

            &.outlined {
                background: white;
                color: var(--brand);
                border: 1px solid var(--dark-brand);

                &:hover {
                    background: rgba(var(--brand-rgb), 0.1);
                }

                &:active {
                    background: rgba(var(--brand-rgb), 0.2);
                    box-shadow: none;
                }
            }

            &.transparent {
                background: transparent;
                color: var(--brand);
                border: none;

                &:hover {
                    background: rgba(var(--brand-rgb), 0.1);
                }

                &:active {
                    background: rgba(var(--brand-rgb), 0.2);
                    box-shadow: none;
                }
            }
        }

        &.disabled {
            outline: 1px solid rgba(var(--foreground-rgb), 0.2);
            outline-offset: -1px;
            color: rgba(var(--foreground-rgb), 0.50);
            cursor: default;
        }
    }

    </style>
