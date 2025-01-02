<script
    lang="ts">
import ChevronRight from "svelte-material-icons/ChevronRight.svelte"
import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte"
import Plus from "svelte-material-icons/Plus.svelte"
import Icon from "$lib/display/Icon.svelte"
import { branch_at_index, scoring_state } from "./scoring.svelte"

let {
    branch,
}: {
    branch: string
} = $props()

let siblings = $derived(scoring_state.branch_to_children[branch] || [])
let parent = $derived(scoring_state.heirarchy.findIndex(b => b === branch))
let current = $derived(scoring_state.heirarchy[parent + 1])
let index = $derived(siblings.findIndex(b => b === current))
let next = $derived(siblings[index + 1])
let prev = $derived(siblings[index - 1])

function set_branch(branch: string | null) {
    if (branch === null) return
    scoring_state.active = branch
}

function create_branch() {
    const b = scoring_state.branch_map[branch]
    branch_at_index(b, b.source.length - 1)
}

</script>
<zero-height-wrapper>
    {#if siblings.length > 0}
        <branch-navigation>
            <button
                disabled={!prev}
                onclick={() => set_branch(prev)}>
                <Icon
                    icon={ChevronLeft} />
            </button>
            <counter>{ index + 1 } / { siblings.length }</counter>
            <button
                disabled={!next}
                onclick={() => set_branch(next)}>
                <Icon
                    icon={ChevronRight} />
            </button>
        </branch-navigation>
    {/if}
    <branch-navigation>
        <button
            onclick={() => create_branch()}>
            <Icon
                icon={Plus} />
        </button>
    </branch-navigation>
</zero-height-wrapper>
<style>

zero-height-wrapper {
    max-height: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

counter {
    opacity: 0.7;
    text-wrap: nowrap;
}

branch-navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    text-wrap: nowrap;
    background: color-mix(in srgb, var(--background), var(--foreground) 5%);
    border-radius: 100px;
    z-index: 2;
}

button {
    padding: 10px;
    gap: 8px;
    border-radius: 50px;
    cursor: default;
    --size: 22px;
    --opacity: 0.2;
    --color: rgba(var(--foreground-rgb));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(var(--foreground-rgb), 0.5);
    font-weight: inherit;

    &:not(:disabled) {
        cursor: pointer;
        --opacity: 0.6;
        &:hover {
            --opacity: 1;
            background: rgba(var(--foreground-rgb), 0.08);
        }
    }
}

</style>    
