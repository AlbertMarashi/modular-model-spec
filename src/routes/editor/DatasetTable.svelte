<script lang="ts">
import Icon from "$lib/display/Icon.svelte"
import { icons, type Thread } from "./editor_types"
import ChatQuestion from "svelte-material-icons/ChatQuestion.svelte"


export let records: Array<Thread>
export let selected_record: Thread | null = null

function keypress(e: KeyboardEvent, record: Thread) {
    if (e.key === "Enter") {
        selected_record = record
    }
}
</script>
<grid-table>
    <header-cell>ID</header-cell>
    <header-cell>Messages</header-cell>
    {#each records as record}
        <thread-row
            class:selected={ record === selected_record }
            role="row"
            tabindex="0"
            on:focus={ () => selected_record = record }
            on:keypress={ (e: KeyboardEvent) => keypress(e, record) }
            on:click={ () => selected_record = record }>
            <thread-id
                role="cell"
                tabindex="0">
                { record.id }
            </thread-id>
            <messages>
                {#each record.messages as message, i}
                    {#if message === null}
                        <message class="unknown">
                            <Icon icon={ChatQuestion}/>
                        </message>
                    {:else}
                        <message
                            class:assistant={ message.role === "assistant" }
                            class:context={ message.role === "context" }
                            class:developer={ message.role === "developer" }
                            class:platform={ message.role === "platform" }
                            class:user={ message.role === "user" }>
                            <Icon icon={icons[message.role]}/>
                            {#if message.role === "assistant"}
                                <format>
                                    -&gt;&gt;
                                    <code>
                                        { message.format }
                                    </code>
                                </format>
                            {/if}
                        </message>
                    {/if}
                    <!-- {#if i !== thread.messages.length - 1}
                        -&gt;&gt;
                    {/if} -->
                {/each}
            </messages>
        </thread-row>
    {/each}
</grid-table>
<style>

grid-table {
    display: grid;
    border: 1px solid rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
    overflow: hidden;
    grid-template-columns: max-content 1fr;
    width: 100%;
    & header-cell {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        color: rgba(var(--foreground-rgb), 0.5);
        background: rgba(var(--foreground-rgb), 0.02);
        padding: 12px;
        text-transform: uppercase;
    }
}

thread-row {
    display: contents;
    cursor: pointer;
    /* grid-template-columns: 0.3fr 1fr; */
    & > * {
        padding: 6px;
        border-top: 1px solid rgba(var(--foreground-rgb), 0.1);
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }
    &:active, &:focus, &:hover {
        & > * {
            background: rgba(var(--foreground-rgb), 0.08);
        }
    }
    &.selected {
        & > * {
            background: rgba(var(--foreground-rgb), 0.05);
        }
    }
}

thread-id {
    color: rgba(var(--foreground-rgb), 0.5);
    font-family: "Fira Code", monospace;
    font-size: 12px;
}

messages {
    display: flex;
    gap: 4px;
    font-family: "Fira Code", monospace;
    font-weight: bold;
    font-size: 12px;
    color: rgba(var(--foreground-rgb), 0.5);
    align-items: center;
    & message {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px;
        --size: 18px;
        background: rgba(var(--color-rgb), 0.1);
        color: color-mix(in srgb, rgba(var(--color-rgb)) 40%, var(--foreground));
        border-radius: 4px;
        &.unknown {
            --color-rgb: var(--red-rgb);
            /* opacity: 0.5; */
        }
        &.assistant {
            --color-rgb: var(--teal-rgb);
        }
        &.developer {
            --color-rgb: var(--blue-rgb);
        }
        &.platform {
            --color-rgb: var(--purple-rgb);
        }
        &.context {
            --color-rgb: var(--yellow-rgb);
        }
        &.user {
            --color-rgb: var(--foreground-rgb);
        }
    }
}

</style>