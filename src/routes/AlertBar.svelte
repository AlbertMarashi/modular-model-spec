<div class="action-container-wrapper">
    {#each $alerts as alert}
        <div
            bind:this={ elements[alert.id] }
            class="action-bar"
            class:error={ alert.type === "error" }
            class:success={ alert.type === "success" }
            class:warning={ alert.type === "warning" }
            role="button"
            tabindex="0"
            on:keypress={ e => {
                if (e.key === "Enter") {
                    remove(alert.id)
                }
            } }
            on:click={ () => remove(alert.id) }>
            <div class="icon">
                <svelte:component
                    this={ icons[alert.type] }
                    --size="22px"/>
            </div>
            <div class="text">
                { alert.message }
            </div>
            <Close --size="22px"/>
        </div>
    {/each}
</div>
<script lang="ts">
import Alert from "svelte-material-icons/Alert.svelte"
import Info from "svelte-material-icons/AlertCircle.svelte"
import Close from "svelte-material-icons/Close.svelte"
import Check from "svelte-material-icons/CheckCircle.svelte"
import { onMount, tick, type ComponentType } from "svelte"
import { browser } from "$app/environment"
import { page } from "$app/stores"
import type { Message } from "$lib/stores/alerts"

$: alerts = $page.data.alerts.store

let elements: { [key: symbol]: HTMLDivElement } = {}

let icons = {
    "info": Info,
    "warning": Alert,
    "error": Alert,
    "success": Check
} satisfies Record<Message["type"], ComponentType>

function remove(id: symbol){
    $alerts = $alerts.filter(val => val.id !== id)
}

let interval: ReturnType<typeof setInterval> | null = null

function intervalFn () {
    $alerts.shift()
    $alerts = $alerts
    setBottomHeights()
}

$: {
    if(browser){
        if($alerts.length === 0 && interval){
            clearInterval(interval)
            interval = null
        } else if($alerts.length !== 0) {
            setBottomHeights()
            if(interval == null) interval = setInterval(intervalFn, 5000)
        }
    }
}

onMount(setBottomHeights)

async function setBottomHeights () {
    await tick()
    let elms = $alerts.map((message: Message) => elements[message.id])
    let heights = 0
    let margin = 10

    for(let i in elms) {
        let el = elms[i]
        let elHeight = el.offsetHeight
        heights += margin
        el.style.bottom = heights + "px"
        heights += elHeight
    }
}

</script>
<style>
.action-container-wrapper {
    position: fixed;
    bottom: 10px;
    left: 0;
    right: 0;
    height: 0;
    display: flex;
    align-items: flex-end;
    z-index: 250;
    justify-content: center;

    & .action-bar {
        cursor: pointer;
        background: color-mix(in srgb, rgba(var(--color-rgb)) 20%, var(--background));
        color: color-mix(in srgb, rgba(var(--color-rgb)) 80%, var(--foreground));
        position: fixed;
        width: 100%;
        max-width: 500px;
        padding: 12px;
        font-weight: 500;
        /* box-shadow: 0 0 5px color-mix(in srgb, black, 10%); */
        border: 1px solid rgba(var(--color-rgb), 0.1);
        border-radius: 5px;
        z-index: 251;
        transition: 0.2s ease-in-out;
        display: grid;
        grid-template-columns: min-content 1fr min-content;
        align-items: center;
        &.warning {
            --color-rgb: var(--orange-rgb);
        }

        &.error {
            --color-rgb: var(--red-rgb);
        }

        &.success {
            --color-rgb: var(--brand-rgb);
        }

        & .icon {
            padding-right: 8px;
            display: inline-flex;
        }
    }
}
</style>