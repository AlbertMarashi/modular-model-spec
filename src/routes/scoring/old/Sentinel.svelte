<script
    lang="ts">

const {
    loadmore,
    loadless,
    rows = 0
} : {
    loadmore?: () => void;
    loadless?: () => void;
    rows?: number;
} = $props()

let sentinel: HTMLElement | null = $state(null)
let running = $state(false)
const MARGIN = 100

function viewport_distance(sentinel: HTMLElement) {
    const rect = sentinel.getBoundingClientRect()
    
    // If element is below viewport
    if (rect.top > window.innerHeight) {
        return rect.top - window.innerHeight
    }
    
    // If element is above viewport
    if (rect.bottom < 0) {
        return rect.bottom
    }
    
    // Element is at least partially visible
    return 0
}


async function handle_visibility() {
    if (running) return
    running = true
    if (!sentinel) return
    while (true) {
        if (!sentinel) return
        const visibility_pixels = Math.abs(viewport_distance(sentinel))


        if (visibility_pixels < MARGIN) {
            loadmore?.()
        } else if (visibility_pixels > MARGIN * 2) {
            loadless?.()
        } else {
            break
        }

        await new Promise(resolve => setTimeout(resolve, 100))
    // await tick()
    }
    running = false
}


$effect(() => {
    if (!sentinel) return

    const observer = new IntersectionObserver(handle_visibility)

    observer.observe(sentinel)

    return () => {
        observer.disconnect()
    }
})

</script>

<sentinel
    bind:this={ sentinel }
    style:--rows={ rows }>
</sentinel>
<style>

sentinel {
    
    position: absolute;
    grid-column: 1 / -1;
    grid-row: var(--rows);
    width: 100%;
    height: 30px;
    background: rgba(var(--blue-rgb), 0.5);
    z-index: 1;
}


</style>
