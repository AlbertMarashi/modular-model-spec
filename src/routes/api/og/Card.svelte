<script lang="ts">
import Logo from "$lib/display/Logo.svelte"
import Robot from "svelte-material-icons/Robot.svelte"
import ChevronDoubleRight from "svelte-material-icons/ChevronDoubleRight.svelte"

export let title: string
export let description: string | null = null
</script>
<div class="card">
    <div class="logo">
        <div class="symbol">
            <Logo size={100}/>
        </div>
    </div>
    <div class="title-area">
        <h1>
            { title }
        </h1>
    </div>
    {#if description}
        <span class="description">{ description }</span>
    {/if}
    <div class="fake-button">
        <div class="icon"><Robot size="1.5em"/></div>
        Read the Spec
        <div class="icon"><ChevronDoubleRight size="1.5em"/></div>
    </div>
</div>
<style>
    .fake-button {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 2.5em;
        font-weight: bold;
        padding-top: 0.5em;
        padding-bottom: 0.5em;
        padding-left: 1em;
        padding-right: 1em;
        text-decoration: none;
        border-radius: 100px;
        color: rgba(0,0,0,0.8);
        background: linear-gradient(90deg, #2e56a2 0%, #339f66 100%);
    }

    .fake-button .icon {
        display: flex;
    }

    .title-area {
        display: flex;
        align-items: flex-end;
    }

    h1 {
        display: flex;
        font-size: 4.5em;
        font-weight: 600;
        line-height: 100%;
    }

    .description {
        font-size: 2.1em;
        line-height: 150%;
        color: rgba(255, 255, 255, 0.75);
    }

    .card {
        background: rgb(21, 24, 28);
        width: 100%;
        padding: 3em;
        gap: 1.5em;
        height: 100%;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        color: white;
        justify-content: center;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.5em;
        font-size: 3em;
        text-decoration: none;
        color: white;
    }

    .symbol {
        font-size: 1.6em;
        display: flex;
        color: rgb(116, 70, 246);
    }

    .icon {
        display: flex;
    }
</style>
