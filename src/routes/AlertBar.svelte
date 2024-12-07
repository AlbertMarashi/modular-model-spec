<script lang="ts">
import Alert from "svelte-material-icons/Alert.svelte"
import Info from "svelte-material-icons/Information.svelte"
import Check from "svelte-material-icons/CheckCircle.svelte"
import Icon from "$lib/display/Icon.svelte"
import type { IconComponent } from "$lib/utils/icon_type"
import type { Message } from "$lib/stores/global"
import { global_state } from "$lib/stores/global"

let icons = {
    "info": Info,
    "warning": Alert,
    "error": Alert,
    "success": Check
} satisfies Record<Message["type"], IconComponent>

const INTERVAL_MS = 5000

function remove(index: number){
    global_state.inner.alerts.splice(index, 1)
    restartInterval()
}

function restartInterval() {
    if (interval) clearInterval(interval)
    interval = setInterval(intervalFn, INTERVAL_MS)
}

let interval: ReturnType<typeof setInterval> | null = null

function intervalFn () {
    console.count("shifting")
    global_state.inner.alerts.shift()
}

$effect(() => {
    if (global_state.inner.alerts.length === 0) {
        if (interval) clearInterval(interval)
        interval = null
    } else {
        restartInterval()
    }
})

</script>
<div class="action-container-wrapper">
    {#each global_state.inner.alerts as alert, i}
        <div
            class="action-bar"
            class:error={ alert.type === "error" }
            class:info={ alert.type === "info" }
            class:success={ alert.type === "success" }
            class:warning={ alert.type === "warning" }
            onclick={() => remove(i)}
            onkeydown={e => {
                if (e.key === "Enter") {
                    remove(i)
                }
            }}
            role="button"
            tabindex="0">
            <Icon icon={icons[alert.type]}/>
            <alert-data>
                {#if alert.code}
                    <code>
                        { alert.code }
                    </code>
                {/if}
                <div class="text">
                    { alert.message }
                </div>
            </alert-data>
        </div>
    {/each}
</div>
<style>
.action-container-wrapper {
    position: fixed;
    bottom: 10px;
    left: 0;
    right: 0;
    height: 0;
    display: flex;
    flex-direction: column-reverse;
    z-index: 150;
    align-items: center;
    justify-content: end;
    gap: 16px;
    pointer-events: none;

    & .action-bar {
        pointer-events: all;
        cursor: pointer;
        background: var(--background);
        width: 100%;
        max-width: 500px;
        padding: 8px;
        font-weight: 500;
        box-shadow: 0 0 5px color-mix(in srgb, black, 10%);
        border-radius: 5px;
        z-index: 251;
        color: rgba(var(--foreground-rgb), 1);
        --color: rgba(var(--color-rgb), 1);
        display: grid;
        grid-template-columns: min-content 1fr;
        align-items: center;
        border: 2px solid rgba(var(--color-rgb), 1);
        gap: 8px;
        &.warning {
            --color-rgb: var(--yellow-rgb)
        }

        &.error {
            --color-rgb: var(--red-rgb)
        }

        &.success {
            --color-rgb: var(--green-rgb)
        }

        &.info {
            --color-rgb: var(--blue-rgb)
        }
    }
}
</style>
