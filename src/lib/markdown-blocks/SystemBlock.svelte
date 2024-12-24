<script
    lang="ts">
import Icon from "$lib/display/Icon.svelte"
import Pause from "svelte-material-icons/Pause.svelte"
import CodeTags from "svelte-material-icons/CodeTags.svelte"
import type { MdxJsxFlowElement } from "mdast-util-mdx"
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx"

export let block: MdxJsxFlowElement

$: config = block.attributes.find(attr => "name" in attr && attr.type === "mdxJsxAttribute" && attr.name === "config") as MdxJsxAttribute
$: data = config.value && typeof config.value !== "string" && "value" in config.value ? JSON.parse(config.value.value) as SystemSettings : null

type SystemSettings = {
    /**
     * allowed message formats for the model/assistant to generate
     * if only one format is supplied, the model MUST respond in that format.
     * otherwise the model is free to choose its format based on instructions
     * provided by the developer or user
     *
     * Can be a string just specifying the name of the format.
     */
    formats: string | Format[]
}

type Format = {
    // name of this format
    name: string
    // whether the system should halt inference before it starts writing the message content
    halt_on_start: boolean
    // whether the system should halt inference on completion of the assistant message content for this format
    halt_on_completion: boolean
    // system-level grammar sampling feautures
    sampler: Sampler | null
}

/**
 * Grammar/token samplers are used to prevent the model from generating illegal tokens,
 * this works by zeroing-out the probability of generating tokens that are not allowed
 * within a specific language or format syntax
 */
type Sampler =
    | "json"
    | "jsonl"
    | CustomSampler
/**
 * Developer provided custom samplers, which we will not discuss in this section
 */
type CustomSampler = null

</script>
<div
    class="system">
    <section>
        <system-heading>
            <Icon
                color="gray"
                icon={CodeTags}/>
            System Settings
        </system-heading>
    </section>
    <section>
        <formats-heading>Allowed Formats</formats-heading>
        <formats>
            {#if data}
                {#each data.formats as format}
                    {#if typeof format === "string"}
                        <format-group>
                            <format>-&gt;&gt; <code>{ format }</code></format>
                        </format-group>
                    {:else}
                        <format-group>
                            <format>-&gt;&gt;<code>{ format.name }</code> -&gt;</format>
                            {#if format.halt_on_start}
                                <tag>
                                    <Icon
                                        icon={Pause}/>
                                    Halt on start
                                </tag>
                            {/if}
                            {#if format.halt_on_completion}
                                <tag>
                                    <Icon
                                        icon={Pause}/>
                                    Halt on completion
                                </tag>
                            {/if}
                            {#if format.sampler}
                                <tag>
                                    <Icon
                                        icon={CodeTags}/>
                                    { format.sampler } Sampler
                                </tag>
                            {/if}
                        </format-group>
                    {/if}
                {/each}
            {/if}
        </formats>
    </section>
</div>
<style>
.system {
    background: rgba(var(--foreground-rgb), 0.1);
    border-radius: 8px;
    /* border: 1px solid rgba(var(--orange-rgb), 0.2); */
    & section {
        padding: 4px 8px;
        /* border-bottom: 1px solid rgba(var(--orange-rgb), 0.2); */
        &:last-child {
            border-bottom: none;
        }
    }
    & system-heading {
        font-weight: bold;
        font-size: 14px;
        font-family: "Fira Code", monospace;
    }
}

formats {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    font-size: 14px;
    gap: 4px;
    overflow: hidden;
}

formats-heading {
    display: flex;
    font-weight: 600;
    font-size: 12px;
    opacity: 1;
    padding-bottom: 4px;
    font-family: "Fira Code", monospace;
}

format-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    &:first-child {
        border-top: none;
    }
}

format {
    display: flex;
    font-family: "Fira Code", monospace;
    align-items: center;
    color: rgba(var(--foreground-rgb), 0.3);
    gap: 4px;
    & code {
        background: rgba(var(--foreground-rgb), 0.1);
        padding: 0 4px;
        color: rgba(var(--foreground-rgb), 1);
        /* border: 1px solid rgba(var(--foreground-rgb), 0.4); */
        border-radius: 4px;
    }
}

tag {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(var(--foreground-rgb), 0.1);
    padding: 0 4px;
    border-radius: 4px;
}

</style>