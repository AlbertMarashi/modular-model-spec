<script lang="ts">

export let maxWidth: string | undefined = undefined
export let padding: string | undefined = undefined
export let direction: "row" | "column" | undefined = undefined
export let gap: string | undefined = undefined
export let justify: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined = undefined
export let align: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined = undefined
</script>
<flex-box
    style:justify-content={ justify }
    style:padding
    style:max-width={ maxWidth }
    style:gap
    style:align-items={ align }
    style:flex-direction={ direction }>
    <slot/>
</flex-box>
<style>

flex-box {
    display: flex;
    width: 100%;
}
</style>