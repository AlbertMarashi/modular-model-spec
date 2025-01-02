<script
    lang="ts">
import TreeBranch from "./TreeBranch.svelte"
import { scoring_state } from "../scoring.svelte"
import { svg_connection } from "./connection"
import { watch } from "runed"

let paths: string[] = $state([])
let svg: SVGElement = $state()!

watch(() => scoring_state.connections, () => {
    paths = []
    for (const connection of scoring_state.connections) {
        paths.push(svg_connection(connection, svg))
    }
})

</script>

<tree>
    <TreeBranch
        branch={scoring_state.heirarchy[0]} />
    <svg
        bind:this={ svg }>
        {#each paths as path}
            <path
                d={path} />
        {/each}
    </svg>
</tree>

<style>
    tree {
        display: flex;
        flex-direction: column;
        padding: 16px;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        min-height: 750px;
        border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
        scrollbar-width: none;
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
    }

    path {
        stroke: rgba(var(--foreground-rgb), 0.1);
        stroke-width: 2px;
        fill: none;
    }

</style>
