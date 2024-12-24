<script
    lang="ts">
import type { Branch } from "./types"
import BranchNode from "./BranchNode.svelte"
import { scoring_state } from "./scoring.svelte"

// Get children for a branch by looking up parent references
function get_children(branch: Branch): Branch[] {
    return Object.values(scoring_state.branch_map)
        .filter(b => b.parent?.id === branch.id.id)
        .sort((a, b) => a.id.id.localeCompare(b.id.id)) // Stable ordering
}
</script>

<tree>
    {#each scoring_state.heirarchy as branch}
        <tree-level>
            <BranchNode
                {branch} />
            {#if get_children(branch).length > 0}
                <branches>
                    {#each get_children(branch) as child}
                        <branch-container>
                            <connector></connector>
                            <BranchNode
                                branch={child} />
                        </branch-container>
                    {/each}
                </branches>
            {/if}
        </tree-level>
    {/each}
</tree>

<style>
    tree {
        display: flex;
        flex-direction: column;
        gap: 32px;
        padding: 16px;
    }

    tree-level {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    branches {
        display: flex;
        gap: 16px;
    }

    branch-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    connector {
        width: 2px;
        height: 24px;
        background: rgba(var(--foreground-rgb), 0.2);
    }
</style>
