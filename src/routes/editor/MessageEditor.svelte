<script
    lang="ts">
import Label from "$lib/display/Label.svelte"
import CodeEditor from "./CodeEditor.svelte"
import EditorThread from "./EditorThread.svelte"
import type { Thread } from "./editor_types"
import { thread_to_tokens } from "./editor_types"
import SingleSelectChipGroup from "$lib/controls/SingleSelectChipGroup.svelte"
import { safe_db } from "$lib/stores/database"
import { UpsertThreadQuery } from "$lib/queries"
import Toggle from "$lib/controls/Toggle.svelte"

let {
    record = $bindable(),
}: {
    record: Thread;
} = $props()

let pretty = $state(true)
let view_type: "editor" | "tokens" | "json" = $state("editor")

$effect(() => {
    save_record($state.snapshot(record))
})

async function save_record(thread: Thread) {
    const db = await safe_db()

    await db.typed(UpsertThreadQuery, {
        thread,
    })
}
</script>

<editor-container>
    <contents>
        <horizontal>
            <Label
                text="Dataset Example" />
            <SingleSelectChipGroup
                buttons={[
                    { left_icon: undefined, label: "Editor", value: "editor" },
                    { left_icon: undefined, label: "Tokens", value: "tokens" },
                    { left_icon: undefined, label: "JSON", value: "json" },
                ]}
                bind:value={ view_type }
            />
        </horizontal>
    </contents>
    <contents>
        {#if view_type === "editor"}
            <EditorThread
                bind:record={ record } />
        {:else if view_type === "tokens"}
            <format>
                Pretty? <Toggle
                    bind:value={ pretty } />
            </format>
            <CodeEditor
                code={thread_to_tokens(record, pretty)}
                editable={false}
                language="tokens"
            />
        {:else if view_type === "json"}
            <CodeEditor
                code={JSON.stringify(record, null, 4)}
                editable={false}
                language="json"
            />
        {/if}
    </contents>
    <!-- <contents>
        <Label text="Training Example" />
        <CodeEditor
            code={JSON.stringify(record.thread, null, 4)}
            editable={false}
            language="json"/>
        <Label text="Example Training Tokens"/>
        <CodeEditor
            code={thread_to_tokens(selected_record.thread, pretty)}
            editable={false}
            language="tokens"/>
    </contents> -->
</editor-container>

<style>
    editor-container {
        /* position: absolute;
    right: 0;
    top: 24px;
    bottom: 24px; */
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        gap: 24px;
        flex: 1 0 0;
        overflow-y: auto;
        max-width: 750px;
        border-left: 1px solid rgba(var(--foreground-rgb), 0.1);
    }

    horizontal {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        width: 100%;
        justify-content: space-between;
    }

    contents {
        padding: 16px 24px;
        border-bottom: 1px solid rgba(var(--foreground-rgb), 0.1);
        display: flex;
        flex-direction: column;
        gap: 16px;
        &:last-child {
            border-bottom: none;
        }
    }

    format {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-family: "Fira Code", monospace;
    }
</style>
