<script
    lang="ts">
import BranchControls from "./BranchControls.svelte"
import BranchEditor from "./BranchEditor.svelte"
import BranchNavigation from "./BranchNavigation.svelte"
import Scorer from "./Scorer.svelte"
import { scoring_state, type BranchLayout } from "./scoring.svelte"

let {
    layout,
    i,
    editing = $bindable(),
}: {
    layout: BranchLayout
    i: number
    editing: boolean
} = $props()

let branch = $derived(scoring_state.heirarchy[i])

</script>
{#key layout}
    <branch
        class:active={ branch === scoring_state.active }
        role="presentation">
        {#if editing}
            <BranchEditor
                branch={branch}
                layout={layout}/>
        {:else}
            <Scorer
                branch={branch}
                layout={layout}
            />
        {/if}
        <BranchControls
            onedit={() => editing = true}
        />
    </branch>
    <BranchNavigation
        branch={branch}/>
{/key}
<style>
    
    branch {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 32px 24px;
        border-radius: 16px;
        background: var(--background);

        /* Markdown marks */
        --text: inherit;
        --styling: #7981db;
        --heading: #1d6a89;
        --code: #c7a1c5;
        --link: #2563eb;
        --list: #d4933e;
        --quote: #6b7280;
        --hr: #9ca3af;

        /* Thread marks */
        --special: #73fff681;

        /* Code marks */
        --punctuation: #6b7280;
        --tag: #2563eb;
        --keyword: #d454d6;
        --ident: #5576ac;
        --function: #2563eb;
        --string: #059669;
        --number: #26dc9f;
        --boolean: #d16b1d;
        --null: #9333ea;
        --type: #0891b2;
        --property: #0891b2;
        --comment: #6b7280;
        --regexp: #d34e4e;
        --bracket: #6b7280;

        &.active {
            outline: 2px solid rgba(var(--foreground-rgb), 0.1);
            outline-offset: 4px;
        }
    }
</style>