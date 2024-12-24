<script lang="ts">
    import Label from "$lib/display/Label.svelte";

    let {
        value = $bindable(0),
        min = 0,
        max = 1,
        step = 0.1,
        label = undefined,
    }: {
        value: number;
        min?: number;
        max?: number;
        step?: number;
        label?: string;
    } = $props();

    // Round value to nearest step
    function roundToStep(val: number): number {
        if (!step) return val;
        return Math.round(val / step) * step;
    }

    // Format display value based on step size
    function formatValue(val: number): string {
        if (!step) return val.toString();

        // Count decimal places in step
        const decimals = step.toString().split(".")[1]?.length || 0;
        return val.toFixed(decimals);
    }

    let dragging = $state(false);
    let startX = $state(0);
    let startValue = $state(0);
    let track = $state(null as HTMLElement | null);

    function calculateValueFromPosition(clientX: number) {
        if (!track) return value;

        const rect = track.getBoundingClientRect();
        const position = clientX - rect.left;
        const percentage = position / rect.width;
        let newValue = min + (max - min) * percentage;

        // Clamp value
        newValue = Math.max(min, Math.min(max, newValue));

        // Round to nearest step
        return roundToStep(newValue);
    }

    function startDrag(e: MouseEvent) {
        if (!track) return;

        dragging = true;
        startX = e.clientX;
        startValue = value;

        // If clicking on track (not thumb), immediately update value
        if (e.target === track) {
            value = calculateValueFromPosition(e.clientX);
            startValue = value;
        }
    }

    function mousemove(e: MouseEvent) {
        if (!dragging || !track) return;

        value = calculateValueFromPosition(e.clientX);
        e.preventDefault(); // Prevent text selection while dragging
    }

    // Calculate thumb position as percentage
    let thumbPosition = $derived(((value - min) / (max - min)) * 100);
</script>

<svelte:window
    onmousemove={mousemove}
    onmouseup={() => (dragging = false)}
    onmouseleave={() => (dragging = false)}
/>

<control-item>
    <header>
        {#if label}
            <Label text={label} />
        {/if}
        <value-display>{formatValue(value)}</value-display>
    </header>
    <slider-container
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        tabindex="-1"
        onmousedown={startDrag}
    >
        <track-element bind:this={track} style:--width={thumbPosition + "%"}>
            <thumb
                role="slider"
                tabindex="0"
                aria-valuenow={value}
                aria-valuemin={min}
                aria-valuemax={max}
                style:left={thumbPosition + "%"}
                onmousedown={(e: MouseEvent) => {
                    e.stopPropagation();
                    startDrag(e);
                }}
            ></thumb>
        </track-element>
    </slider-container>
</control-item>

<style>
    control-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    value-display {
        font-size: 14px;
        font-weight: 500;
        opacity: 0.8;
    }

    slider-container {
        display: flex;
        cursor: pointer;
        width: 100%;
    }

    track-element {
        position: relative;
        width: 100%;
        height: 4px;
        background: rgba(var(--foreground-rgb), 0.1);
        border-radius: 2px;
        margin: 8px 0; /* Add margin to accommodate step markers */
        &::before {
            content: "";
            position: absolute;
            width: var(--width);
            height: 100%;
            background: rgba(var(--brand-rgb), 0.5);
            border-radius: 2px;
            pointer-events: none;
        }
    }

    thumb {
        position: absolute;
        top: 50%;
        width: 16px;
        height: 16px;
        background: var(--brand);
        border-radius: 100px;
        transform: translate(-50%, -50%);
        cursor: grab;
        transition: transform 0.1s;
        pointer-events: all;
    }

    thumb:hover {
        transform: translate(-50%, -50%) scale(1.1);
    }

    thumb:active {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(0.95);
    }
</style>
