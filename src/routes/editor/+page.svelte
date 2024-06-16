<script lang="ts">
import Button from "$lib/controls/Button.svelte"
import type { Message } from "$lib/types/messages"
import AddMessage from "./AddMessage.svelte"
import CodeEditor from "./CodeEditor.svelte"
import EditorMessage from "./EditorMessage.svelte"
import PickMessage from "./PickMessage.svelte"


type Thread = {
    system_config: SystemConfig
    messages: Array<Message | null>
}

type SystemConfig = {
    formats: AllowedAssistantFormats[]
}

type AllowedAssistantFormats = {
    name: string
    halt_on_start: boolean
    halt_on_completion: boolean
    sampler: "json" | "text"
}

let thread: Thread = {
    system_config: {
        formats: [

        ]
    },
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

let selected: number = thread.messages.length - 1

function insert(index: number) {
    thread.messages.splice(index, 0, null)
    thread.messages = thread.messages

    selected = index
}

function delete_message(index: number) {
    thread.messages.splice(index, 1)
    thread.messages = thread.messages
    selected = null
}

</script>
<editor-wrapper>
    {#each thread.messages as message, i}
        {#if message !== null}
            <EditorMessage
                index={i}
                bind:selected
                on:insert_above={ () => insert(i) }
                on:insert_below={ () => insert(i + 1) }
                on:delete={ () => delete_message(i) }
                bind:message/>
        {:else}
            <PickMessage
                index={i}
                on:delete={ () => delete_message(i) }
                bind:selected
                bind:message/>
        {/if}
    {/each}
</editor-wrapper>

<!-- <CodeEditor
    code={JSON.stringify(thread, null, 4)}
    language="json"/> -->

<style>

editor-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    gap: 16px;

}

</style>