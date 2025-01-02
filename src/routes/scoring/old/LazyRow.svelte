<script
    lang="ts">
import type { Snippet } from "svelte"

const {
    children
}: {
    children: Snippet
} = $props()

let visible = $state(false)
let row: HTMLElement = $state()!

$effect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => visible = entry.isIntersecting,
        {
            rootMargin: "100px",
        }
    )
    observer.observe(row)

    return () => observer.disconnect()
})

</script>
<row
    bind:this={ row }>
    {#if visible}
        {@render children()}
    {/if}
</row>
<style>


row {
    display: grid;
    grid-template-columns: repeat(80, 1fr);
    grid-auto-flow: column;
    grid-column: 1 / -1;
}
</style>