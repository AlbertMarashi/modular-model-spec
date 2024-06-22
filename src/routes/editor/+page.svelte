<script lang="ts">
import Toggle from "$lib/controls/Toggle.svelte"
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
            content: "This is a developer message, a type of message defined by the developer building the LLM powered application, often referred to as the `system` message by other formats and specs.\n\nYou can click to edit me"
        },
        {
            role: "user",
            content: "This is a user message, a type of message sent by the end-user of the LLM-augmented application."
        },
        {
            role: "assistant",
            format: "markdown",
            content: "This is an assistant message, a type of message that the model responds to.\n\nAssistant messages always define a response format via the `format` field, in this case, the `markdown` format. The assistant message also defines a `end_turn` field, which is a boolean value that indicates whether the assistant has finished responding.",
            end_turn: true,
        },
    ]
}

let pretty = true

</script>
<PageHead
    description="Message editor for the modular model spec"
    title="Message Editor"/>
<editor-container>
    <aside>
        <EditorThread bind:thread/>
    </aside>

    <aside>
        <Label text="Training Example"/>
        <CodeEditor
            code={JSON.stringify(thread, null, 4)}
            editable={false}
            language="json"/>
        <Label text="Example Training Tokens"/>
        <format>
            Pretty? <Toggle bind:value={ pretty }/>
        </format>
        <CodeEditor
            code={thread_to_tokens(thread, pretty)}
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

format {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-family: "Fira Code", monospace;
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