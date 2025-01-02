<script
    lang="ts">
import {
    branch_at_cursor,
    scoring_state,
    init_scoring_state,
} from "./scoring.svelte"
import Slider from "$lib/controls/Slider.svelte"
import Selector from "$lib/controls/Selector.svelte"
import Label from "$lib/display/Label.svelte"
import Button from "$lib/controls/Button.svelte"
import { init_branches } from "./init_state"
import Branch from "./Branch.svelte"

init_scoring_state()
init_branches()

const generation = $state({
    model: "gpt-4",
    sampler: null,
    // stop: END_MESSAGE,
    temperature: 0.7,
    max_tokens: 1024,
})

let editing = $state(false)

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
    if (editing) return
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

        const s = scoring_state
        const branch_mapping = $state.snapshot(s.branch_mapping)
        const relative_mapping = $state.snapshot(s.relative_mapping)

        console.log(relative_mapping)

        // Update scores for the selected range
        for (let i = start; i <= end; i++) {
            const branch_index = branch_mapping[i]
            const relative_index = relative_mapping[i]

            const branch = scoring_state.heirarchy[branch_index]

            scoring_state.branch_map[branch].scores[relative_index] = score
        }

        scoring_state.cursor_start = scoring_state.cursor_end = end + 1
    }

    if (e.key === "ArrowRight" && end < scoring_state.chars.length - 1)
        scoring_state.cursor_start = scoring_state.cursor_end = end + 1
    if (e.key === "ArrowLeft" && start >= 1)
        scoring_state.cursor_start = scoring_state.cursor_end = start - 1
}

function get_target_index(e: MouseEvent): number | null {
    if (editing) return null
    const target = e.target as HTMLElement
    const index = target.getAttribute("i")
    if (index === null) return null
    return parseInt(index)
}

function handle_click(e: MouseEvent) {
    const i = get_target_index(e)
    if (i === null) return
    scoring_state.cursor_start = scoring_state.cursor_end = i
}

function handle_mouse_down(e: MouseEvent) {
    const i = get_target_index(e)
    if (i === null) return
    scoring_state.cursor_start = scoring_state.cursor_end = i
    scoring_state.dragging = true
}

function handle_mouse_over(e: MouseEvent) {
    if (!scoring_state.dragging) return
    const i = get_target_index(e)
    if (i === null) return
    scoring_state.cursor_end = i
}

</script>

<svelte:window
    onclick={handle_click}
    onkeydown={keydown}
    onmousedown={handle_mouse_down}
    onmouseover={handle_mouse_over}
    onmouseup={() => (scoring_state.dragging = false)} />

<page-layout>
    <content-area>
        <!-- <Tree /> -->
        <thread>
            {#each scoring_state.layouts as layout, i}
                <Branch
                    i={i}
                    layout={layout}
                    bind:editing={ editing }
                />
            {/each}
        </thread>
    </content-area>

    <sidebar>
        <section>
            <control-group>
                <Button
                    label={editing ? "Save" : "Edit"}
                    type="tonal"
                    on:click={ () => editing = !editing } />
                <Button
                    label="Branch"
                    type="tonal"
                    on:click={ branch_at_cursor } />
            </control-group>
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
        overflow-y: auto;
        background: rgba(var(--foreground-rgb), 0.05);
        display: flex;
        flex: 1;
        align-items: center;
        flex-direction: column;
        scrollbar-color: rgba(var(--foreground-rgb), 0.1) transparent;
        scrollbar-gutter: stable;
        padding-bottom: 400px;
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

    control-group {
        display: grid;
        grid-auto-flow: column;
        gap: 8px;
    }

</style>
