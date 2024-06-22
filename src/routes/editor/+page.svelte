<script lang="ts">
import Label from "$lib/display/Label.svelte"
import PageHead from "$lib/PageHead.svelte"
import CodeEditor from "./CodeEditor.svelte"
import { thread_to_tokens, type Thread } from "./editor_types"
import EditorThread from "./EditorThread.svelte"


let thread: Thread = {
    allowed_formats: [
        {
            name: "markdown",
            halt_on_start: false,
            halt_on_completion: false,
            sampler: null,
        }
    ],
    messages: [
        {
            role: "developer",
            content: "This is a developer message"
        },
        {
            role: "assistant",
            format: "markdown",
            content: "This is an assistant message",
            end_turn: true,
        },
        {
            role: "context",
            name: "context_name",
            content: "This is a context message"
        },
        {
            role: "user",
            content: "This is a user message"
        }
    ]
}


</script>
<PageHead
    description="Message editor for the modular model spec"
    title="Message Editor"/>
<editor-container>
    <aside>
        <EditorThread bind:thread/>
    </aside>

    <aside>
        <Label text="Message Format"/>
        <CodeEditor
            code={JSON.stringify(thread, null, 4)}
            editable={false}
            language="json"/>

        <Label text="Example Tokens"/>
        <CodeEditor
            code={thread_to_tokens(thread)}
            editable={false}
            language="tokens"/>
    </aside>
</editor-container>

<style>

editor-container {
    display: flex;
    flex-direction: row;
    gap: 16px;
    flex: 1;
}


aside {
    display: flex;
    flex-direction: column;
    padding: 32px;
    border-left: 1px solid rgba(var(--foreground-rgb), 0.1);
    flex: 1;
    gap: 16px;
    &:first-child {
        border-left: none;
    }
}

</style>