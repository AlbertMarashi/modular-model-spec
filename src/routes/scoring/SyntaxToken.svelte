<script
    lang="ts">
import { TokenFlag, TokenKeys } from "./parser/types"
import type { RenderToken } from "./scoring.svelte"

const {
    render_token,
}: {
    render_token: RenderToken
} = $props()

function getClassNames() {
    const flags = render_token.token.flags
    const class_names: string[] = TokenKeys // Get all enum keys
        .filter(
            key =>
                (flags & TokenFlag[key as keyof typeof TokenFlag]) !== 0,
        ) // Check if flag is set

    if (render_token.token.error) class_names.push("error")

    return class_names.join(" ")
}

</script>
<chars
    style:--length={ render_token.len }
    style:--error-str={ JSON.stringify(render_token.token.error) }
    class={getClassNames()}
    class:error={ render_token.token.error } 
    class:return={ render_token.text === "<|content|>" }
    class:special={ render_token.token.flags & TokenFlag.special }
    class:start={ render_token.token.flags & TokenFlag.special && (
        render_token.text === "<|end_turn|>" ||
        render_token.text === "<|role|>" ||
        render_token.text === "<|end_message|>"
    ) }>{ render_token.text }</chars>
<style>
chars {

    &.punctuation {
        color: rgba(255, 255, 255, 0.4);
    }

    &.string {
        color: var(--string);
    }
    &.number {
        color: var(--number);
    }
    &.boolean {
        color: var(--boolean);
    }
    &.null {
        color: var(--null);
    }
    &.keyword {
        color: var(--keyword);
    }
    &.operator {
        color: var(--operator);
    }
    &.comment {
        color: var(--comment);
    }
    &.identifier {
        color: var(--identifier);
    }
    &.function {
        color: var(--function);
    }
    &.variable {
        color: var(--variable);
    }
    &.type {
        color: var(--type);
    }
    &.regex {
        color: var(--regex);
    }
    &.escape {
        color: var(--escape);
    }
    &.bold {
        font-weight: bold;
        color: var(--styling);
    }
    &.italic {
        font-style: italic;
        color: var(--styling);
    }
    &.underline {
        text-decoration: underline;
    }
    &.strikethrough {
        text-decoration: line-through;
    }
    &.heading {
        color: var(--heading);
    }
    &.code {
        color: var(--code);
    }
    &.link {
        color: var(--link);
    }
    &.list {
        color: var(--list);
    }
    &.quote {
        color: var(--quote);
    }
    &.hr {
        color: var(--hr);
    }
    &.language {
        color: var(--code);
    }
}


.special {
    position: relative;
    color: var(--special);
}
</style>