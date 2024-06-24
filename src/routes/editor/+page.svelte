<script lang="ts">
import PageHead from "$lib/PageHead.svelte"
import DatasetTable from "./DatasetTable.svelte"
import MessageEditor from "./MessageEditor.svelte"
import type { DatasetRecord } from "./editor_types"


let selected_record: DatasetRecord | null = null
let dataset: Array<DatasetRecord> = [
    {
        id: "1",
        thread: {
            allowed_formats: [
                {
                    name: "markdown",
                    // halt_on_start: false,
                    halt_on_completion: false,
                // sampler: null,
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
        },
        tags: [],
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: "2",
        thread: {
            allowed_formats: [
                {
                    name: "markdown",
                    // halt_on_start: false,
                    halt_on_completion: false,
                // sampler: null,
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
        },
        tags: [],
        created_at: new Date(),
        updated_at: new Date(),
    }
]

$: if(selected_record) dataset = dataset

</script>
<PageHead
    description="Message editor for the modular model spec"
    title="Message Editor"/>
<page>
    <table-wrapper>
        <DatasetTable
            bind:dataset
            bind:selected_record/>
    </table-wrapper>
    {#if selected_record}
        <MessageEditor bind:selected_record/>
    {/if}
</page>


<style>

page {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: relative;
}

table-wrapper {
    display: flex;
    flex-direction: column;
    padding: 24px;
    flex: 1.2;
    height: 100%;
}

</style>