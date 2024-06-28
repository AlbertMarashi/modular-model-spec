<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import Forum from "svelte-material-icons/Forum.svelte"
import EditorMessage from "./EditorMessage.svelte"
import PickMessage from "./PickMessage.svelte"
import type { Thread } from "./editor_types"
import SystemConfig from "./SystemConfig.svelte"

export let record: Thread

let selected: number | null | "config" = record.messages.length - 1

function insert(index: number) {
    record.messages.splice(index, 0, null)
    record.messages = record.messages

    selected = index
}

function delete_message(index: number) {
    record.messages.splice(index, 1)
    record.messages = record.messages
    selected = null
}


</script>
<thread>
    <section-heading>
        <Icon icon={Forum}/>
        Thread
    </section-heading>
    <inner>
        <messages>
            <SystemConfig
                bind:selected
                bind:thread={ record }/>
            {#if record.messages.length > 0}
                {#each record.messages as message, i}
                    {#if message !== null}
                        <EditorMessage
                            index={i}
                            bind:selected
                            bind:formats={ record.allowed_formats }
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
            {:else}
                <PickMessage
                    deletable={false}
                    index={0}
                    on:delete={ () => delete_message(0) }
                    bind:selected
                    bind:message={ record.messages[0] }/>
            {/if}
        </messages>
    </inner>
</thread>

<style>


inner {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    /* background: rgba(var(--foreground-rgb), 0.02);
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px; */
}

thread {
    max-width: 100%;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    width: 100%;

    & section-heading {
        display: flex;
        align-items: center;
        gap: 4px;
        padding-left: 16px;
        padding-top: 16px;
        padding-right: 16px;
        padding-bottom: 16px;
        color: rgba(var(--foreground-rgb), 1);
        font-weight: bold;
        font-size: 16px;
        font-family: "Fira Code", monospace;
    }

    & messages {
        display: flex;
        flex-direction: column;
        /* padding: 16px; */
        border-radius: 8px;
        width: 100%;
        flex: 1;
        margin: 0 auto;
        gap: 16px;
    }
}

</style>