<script
    lang="ts">
import Scrollbar from "./Scrollbar.svelte"

let viewport: Element
let contents: Element
export let scale: number | undefined = undefined
export let content_width: string | undefined = undefined
export let content_height: string | undefined = undefined
</script>

<div
    class="wrapper">
    <div
        bind:this={ viewport }
        class="viewport">
        <div
            bind:this={ contents }
            style:transform={ `scale(${scale})` }
            style:width={ content_width }
            style:height={ content_height }
            class="contents">
            <slot/>
        </div>
    </div>
    <Scrollbar
        alwaysVisible={true}
        {contents}
        hideAfter={0}
        {viewport}
    />
</div>

<style>
.wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    width: 100%;
    min-height: 0;
    --svrollbar-track-background: var(--scrollbar-background, var(--background));
    --svrollbar-thumb-background: var(--scrollbar-thumb, rgba(var(--foreground-rgb), 0.15));

    & .contents {
        min-width: 100%;
        min-height: 100%;
    }

    & .viewport {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: scroll;
        box-sizing: border-box;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>