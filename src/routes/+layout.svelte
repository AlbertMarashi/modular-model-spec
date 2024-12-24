<script
    lang="ts">
import "./global.css"
import "./variables.css"
import "./normalise.css"
import AlertBar from "./AlertBar.svelte"
import PageLoaderBar from "./PageLoaderBar.svelte"
import Header from "./Header.svelte"

let dark_mode = true
</script>
<main
    class:dark_mode={ dark_mode }>
    <PageLoaderBar/>
    <AlertBar/>
    <Header
        bind:dark_mode={ dark_mode }/>
    <slot />
</main>
<style>
main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--background);
    color: var(--foreground);
    min-height: 100%;
    &.dark_mode {
        --background-rgb: 17, 20, 25;
        --background: rgb(var(--background-rgb));

        --foreground-rgb: 255, 255, 255;
        --foreground: rgb(var(--foreground-rgb));
    }
}
</style>
