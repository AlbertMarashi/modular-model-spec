<script
    lang="ts">
import BranchNode from "./BranchNode.svelte"
import type { Branch } from "../types"
import TreeBranch from "./TreeBranch.svelte"
import { scoring_state } from "../scoring.svelte"

let {
    branch
}: {
    branch: Branch
} = $props()

function get_children(branch: Branch): Branch[] {
    return Object.values(scoring_state.branch_map)
        .filter(b => b.parent?.id === branch.id.id)
        .sort((a, b) => a.id.id.localeCompare(b.id.id)) // Stable ordering
}

let children = $derived(get_children(branch))
</script>

<branch>
    <BranchNode
        branch={branch} />
    {#if children.length > 0}
        <branches>
            {#each children as child}
                <TreeBranch
                    branch={child} />
            {/each}
        </branches>
    {/if}
</branch>
<style>
    branch {
        display: flex;
        flex-direction: column;
        gap: 48px;
        align-items: center;
    }

    branches {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 200px;
        gap: 16px;
    }
</style>