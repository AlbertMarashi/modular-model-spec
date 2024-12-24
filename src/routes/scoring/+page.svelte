<script
    lang="ts">
import Scorer from "./Scorer.svelte"
import {
    branch,
    scoring_state,
    init_scoring_state,
} from "./scoring.svelte"
import Slider from "$lib/controls/Slider.svelte"
import Selector from "$lib/controls/Selector.svelte"
import Label from "$lib/display/Label.svelte"
import Button from "$lib/controls/Button.svelte"
import { init_branches } from "./init_state"
import BranchNavigation from "./BranchNavigation.svelte"
import BranchControls from "./BranchControls.svelte"

init_scoring_state()
init_branches()

let generation = $state({
    model: "gpt-4",
    sampler: null,
    // stop: END_MESSAGE,
    temperature: 0.7,
    max_tokens: 1024,
})
let dragging = $state(false)

const keymap: Record<string, number> = {
    Delete: 0,
    Backspace: 0,
    "1": -1,
    "2": -0.8,
    "3": -0.6,
    "4": -0.4,
    "5": -0.2,
    "6": 0.2,
    "7": 0.4,
    "8": 0.6,
    "9": 0.8,
    "0": 1,
}

// Handle keydown events
function keydown(e: KeyboardEvent) {
    const score = keymap[e.key]
    const start = Math.min(
        scoring_state.cursor_start,
        scoring_state.cursor_end,
    )
    const end = Math.max(
        scoring_state.cursor_start,
        scoring_state.cursor_end,
    )

    if (score !== undefined) {
        e.preventDefault()

        let s = scoring_state
        // Get the hierarchy once
        const hierarchy = s.heirarchy
        const branch_mapping = $state.snapshot(s.branch_mapping)
        const relative_mapping = $state.snapshot(s.relative_mapping)

        // Update scores for the selected range
        for (let i = start; i <= end; i++) {
            const branch_index = branch_mapping[i]
            const relative_index = relative_mapping[i]

            const branch = hierarchy[branch_index]

            branch.scores[relative_index] = score
        }

        scoring_state.cursor_start = scoring_state.cursor_end = end + 1
    }

    if (e.key === "ArrowRight" && end < scoring_state.chars.length - 1)
        scoring_state.cursor_start = scoring_state.cursor_end = end + 1
    if (e.key === "ArrowLeft" && start >= 1)
        scoring_state.cursor_start = scoring_state.cursor_end = start - 1
}
</script>

<svelte:window
    onkeydown={keydown}
    onmouseup={() => (dragging = false)} />

<page-layout>
    <content-area>
        <thread>
            {#each scoring_state.heirarchy as branch, i (branch.id.id)}
                <branch>
                    <Scorer
                        branch={branch.id}
                        tokens={scoring_state.branch_tokens[i]}
                        bind:dragging={ dragging }
                    />
                    <BranchControls/>
                </branch>
                <BranchNavigation/>
            {/each}
        </thread>
        <!-- <Tree /> -->
    </content-area>

    <sidebar>
        <section>
            <Button
                label="Branch at Position"
                type="tonal"
                on:click={ branch } />
            <!-- <control-group class="horizontal">
                <Chip label="Branch" style="filled" />
                <Chip label="Generate" />
                <Chip label="Improve" />
            </control-group> -->
        </section>
        <section>
            <Selector
                label="Model"
                options={[
                    { value: "gpt-4", label: "GPT-4" },
                    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
                    { value: "claude-3-opus", label: "Claude 3 Opus" },
                    { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
                ]}
                bind:value={ generation.model }
            />
            <Selector
                label="Sampler"
                options={[
                    { value: null, label: "None" },
                    { value: "json", label: "JSON" },
                ]}
                bind:value={ generation.sampler }
            />

            <Slider
                label="Temperature"
                max={1}
                min={0}
                step={0.1}
                bind:value={ generation.temperature }
            />
            <Slider
                label="Max Tokens"
                max={4096}
                min={1}
                step={64}
                bind:value={ generation.max_tokens }
            />
            <Button
                label="Generate"
                type="tonal" />
            <hint> Creates a branch at the current cursor position. </hint>
        </section>
        <section>
            <Label
                text="Export" />
        </section>
    </sidebar>
</page-layout>

<style>
    page-layout {
        display: flex;
        overflow: hidden;
        flex: 1;
    }

    content-area {
        padding: 24px;
        overflow-y: auto;
        background: rgba(var(--foreground-rgb), 0.05);
        display: flex;
        flex: 1;
        align-items: center;
        flex-direction: column;
        /* remove the scrollbar background */
        scrollbar-color: rgba(var(--foreground-rgb), 0.1) transparent;
        scrollbar-gutter: stable;
    }

    hint {
        opacity: 0.5;
        font-size: 14px;
    }


    sidebar {
        background: var(--background);
        border-left: 1px solid rgba(var(--foreground-rgb), 0.1);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        max-width: 350px;
        width: 100%;

        section {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
            gap: 16px;
            padding: 24px;
        }
    }

    thread {
        display: flex;
        flex-direction: column;
        max-width: 800px;
        width: 100%;
        min-width: 0;
        padding: 48px 0;
    }

    branch {
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 32px 24px;
        border-radius: 16px;
        background: var(--background);
        /* border-bottom: 2px dashed rgba(var(--foreground-rgb), 0.1); */

        /* &:first-child {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            border-bottom: none;
        } */


        /* 
        &::after, &::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 30px;
        }

        &:not(:last-child) {
            &::after {
                bottom: 0;
                background: linear-gradient(
                    to bottom,
                    var(--background),
                    rgba(var(--foreground-rgb), 0.05)
                );
            }
        }
        &:not(:first-child) {
            &::before {
                top: 0;
                background: linear-gradient(
                    to top,
                    var(--background),
                    rgba(var(--foreground-rgb), 0.05)
                );
            }
        } */
    }


</style>
