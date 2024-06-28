<script lang="ts">
import ScrollbarRegion from "$lib/ScrollbarRegion.svelte"
import Label from "$lib/display/Label.svelte"
import CodeEditor from "./CodeEditor.svelte"
import EditorThread from "./EditorThread.svelte"
import type { Thread } from "./editor_types"
import { thread_to_tokens } from "./editor_types"
import SingleSelectChipGroup from "$lib/controls/SingleSelectChipGroup.svelte"

export let selected_record: Thread
let pretty = true

let view_type: "editor" | "tokens" | "json" = "editor"
</script>

<editor-container>
    <ScrollbarRegion>
        <contents>
            <horizontal>
                <Label text="Dataset Example"/>
                <SingleSelectChipGroup
                    buttons={[
                        { left_icon: undefined, label: "Editor", value: "editor" },
                        { left_icon: undefined, label: "Tokens", value: "tokens" },
                        { left_icon: undefined, label: "JSON", value: "json" },
                    ]}
                    bind:value={ view_type }/>
            </horizontal>
        </contents>
        <contents>
            {#if view_type === "editor"}
                <EditorThread bind:record={ selected_record }/>
            {:else if view_type === "tokens"}
                <CodeEditor
                    code={thread_to_tokens(selected_record, pretty)}
                    editable={false}
                    language="tokens"/>
            {:else if view_type === "json"}
                <CodeEditor
                    code={JSON.stringify(selected_record, null, 4)}
                    editable={false}
                    language="json"/>
            {/if}
        </contents>
        <!-- <contents>
            <Label text="Training Example"/>
            <CodeEditor
                code={JSON.stringify(selected_record.thread, null, 4)}
                editable={false}
                language="json"/>
            <Label text="Example Training Tokens"/>
            <format>
                Pretty? <Toggle bind:value={ pretty }/>
            </format>
            <CodeEditor
                code={thread_to_tokens(selected_record.thread, pretty)}
                editable={false}
                language="tokens"/>
        </contents> -->
    </ScrollbarRegion>
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
    z-index: 10;
    gap: 24px;
    flex: 1;
    overflow-y: auto;
    max-width: 800px;
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