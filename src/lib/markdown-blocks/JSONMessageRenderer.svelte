<script lang="ts">
import type { Thread } from "$lib/types/messages"
import CodeBlock from "./CodeBlock.svelte"


export let thread: Thread

</script>
{#each thread as message}
    {#if message instanceof Array}
        <columns>
            {#each message as subthread}
                <column>
                    {#if subthread instanceof Array}
                        <svelte:self thread={subthread} />
                    {:else}
                        <CodeBlock
                            code={JSON.stringify(subthread, null, 4)}
                            language="json" />
                    {/if}
                </column>
            {/each}
        </columns>
    {:else}
        <CodeBlock
            code={JSON.stringify(message, null, 4)}
            language="json" />
    {/if}
{/each}
<style>
columns {
    display: flex;
    gap: 8px;
}

column {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;
}
</style>