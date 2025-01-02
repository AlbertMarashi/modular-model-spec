<script
    lang="ts">
import type { Branch } from "../types"
import { onMount } from "svelte"

let {
    branch
}: {
    branch: Branch
} = $props()

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

const CELL_WIDTH = 2
const CELL_HEIGHT = 4
const CANVAS_WIDTH = 150

onMount(() => {
    ctx = canvas.getContext("2d")!
    drawScores()
})

const rgba = (r: number, g: number, b: number, a: number) => `rgba(${r}, ${g}, ${b}, ${a})`
const red = (a: number) => rgba(200, 20, 20, a)
const green = (a: number) => rgba(10, 200, 45, a)

function drawScores() {
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const width = CELL_WIDTH
    const height = CELL_HEIGHT

    branch.scores.forEach((score, i) => {
        let s = score * 0.75
        ctx.fillStyle = score < 0 ? red(Math.abs(s)) : green(Math.abs(s))
        ctx.fillRect((i * width) % canvas.width, Math.floor((i * width) / canvas.width) * height, width, height)
    })
}

$effect(() => {
    if (ctx) {
        drawScores()
    }
})
</script>

<node
    id={branch.id.id}>
    <canvas
        bind:this={ canvas }
        height={Math.ceil((branch.scores.length * CELL_WIDTH) / CANVAS_WIDTH) * CELL_HEIGHT}
        width={CANVAS_WIDTH}>
    </canvas>
</node>

<style>
    canvas {
        image-rendering: pixelated;
        width: 100%;
        height: 100%;
    }

    node {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: max-content;
        gap: 0;
        padding: 8px;
        background: rgba(var(--background-rgb), 1);
        border: 1px solid rgba(var(--foreground-rgb), 0);
        border-radius: 4px;
    }
</style>
