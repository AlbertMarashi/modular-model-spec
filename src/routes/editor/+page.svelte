<script lang="ts">
import PageHead from "$lib/PageHead.svelte"
import Button from "$lib/controls/Button.svelte";
import { safe_db } from "$lib/stores/database";
import DatasetTable from "./DatasetTable.svelte"
import MessageEditor from "./MessageEditor.svelte"
import type { Thread } from "./editor_types"
import Plus from "svelte-material-icons/Plus.svelte"

let { data } = $props()

let records = $state(data.records)
let selected_record: string | null = $state(null)
let record: Thread | null = $state(null)

$effect(() => {
    if (selected_record) record = records.find(r => r.id.id === selected_record) || null
})



async function add_record() {
    const db = await safe_db()
    let [[thread]] = await db.query<[[Thread]]>(`
        CREATE thread SET
            allowed_formats = $allowed_formats,
            messages = $messages
    `, {
        allowed_formats: [
            {
                name: "markdown",
                halt_on_completion: false,
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
    })

    records.push(thread)
    selected_record = thread.id.id
}

</script>
<PageHead
    description="Message editor for the modular model spec"
    title="Message Editor"/>
<page>
    <table-wrapper>
        <Button
            type="tonal"
            label="Add Thread"
            right_icon={Plus}
            on:click={add_record}/>
        <DatasetTable
            bind:records
            bind:selected_record/>
    </table-wrapper>
    {#if record}
        <MessageEditor bind:record/>
    {/if}
</page>


<style>

page {
    display: flex;
    flex-direction: row;
    flex: 1;
    /* height: 100%;
    width: 100%; */
    overflow-y: auto;
    position: relative;
}

table-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 24px;
    flex: 1.2 0 0;
    height: 100%;
    gap: 16px;
}

</style>
