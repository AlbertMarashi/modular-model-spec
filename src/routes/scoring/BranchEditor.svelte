<script
    lang="ts">
import { scoring_state, type RenderToken } from "./scoring.svelte"
import SyntaxToken from "./SyntaxToken.svelte"

const {
    branch = $bindable(),
    layout,
}: {
    branch: string
    layout: RenderToken[]
} = $props()

</script>

<code-editor>
    <pseudo-text-area
        class="text-area">
        {#each layout as token}
            <SyntaxToken
                render_token={token}
            />
        {/each}
    </pseudo-text-area>
    <textarea
        class="text-area"
        bind:value={ scoring_state.branch_map[branch].source }></textarea>
</code-editor>
<style>

code-editor {
    display: grid;
    position: relative;
}

textarea {
    position: absolute;
    color: transparent;
    caret-color: rgba(var(--blue-rgb), 1);
    z-index: 1;
}

.text-area {
    width: 100%;
    height: 100%;
    grid-row: 1;
    grid-column: 1;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: "Fira Code", monospace;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.25em;
    padding: 4px;
    resize: none;
    border: none;
    outline: none;
    background: transparent;

}

</style>