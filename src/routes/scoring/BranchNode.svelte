<script
    lang="ts">
import { score_color } from "./render_utils"

let { branch } = $props()
</script>

<node>
    {#each branch.scores as score}
        <score
            style:--color={ score_color(score) }></score>
    {/each}
</node>

<style>
    score {
        background: var(--color);
        height: 4px;
        width: 1px;
    }

    node {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0;
        padding: 8px;
        background: rgba(var(--background-rgb), 1);
        border: 1px solid rgba(var(--foreground-rgb), 0);
        max-width: 300px;
        border-radius: 4px;
    }
</style>
