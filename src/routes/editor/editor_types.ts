import Robot from "svelte-material-icons/Robot.svelte"
import CodeBraces from "svelte-material-icons/CodeBraces.svelte"
import Web from "svelte-material-icons/Web.svelte"
import HammerScrewdriver from "svelte-material-icons/HammerScrewdriver.svelte"
import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
import type { RecordId } from "$lib/pojo_surreal"

export type Thread = {
    id: RecordId<"thread">
    allowed_formats: Array<AllowedAssistantFormat>
    messages: Array<Message | null>
    tags: Array<string>
    created_at: Date
    updated_at: Date
}

export type AllowedAssistantFormat = {
    name: string
    halt_on_completion: boolean
    // halt_on_start: boolean
    // sampler: "json" | null
}

export const icons = {
    "assistant": Robot,
    "developer": CodeBraces,
    "platform": Web,
    "context": HammerScrewdriver,
    "user": AccountCircle
}


export type Message =
    | Assistant
    | Developer
    | Platform
    | User
    | Context

/* an LLM generated response */
export type Assistant = {
    role: "assistant"
    // the response format or recipient of a tool
    format: string
    content: string
    // whether this assistant ended it's turn
    end_turn: boolean,
}

/* An LLM developer instruction */
export type Developer = {
    role: "developer"
    content: string
}

/* An instruction provided by the LLM platform or API service */
export type Platform = {
    role: "platform"
    content: string
}

/* A end-user provided instruction */
export type User = {
    role: "user"
    content: string
}

// Contexts are message types that the developer can use to provide contextual information to the model.
// Context contents are treated as information rather than instructions, except where specified by the developer.
export type Context = {
    role: "context"
    // optional name of the context, so it can be referred to in the developer message
    name: string | null
    // Data returned from a tool
    content: string
}

export function thread_to_tokens(thread: Thread, pretty: boolean): string {
    let tokens = ""

    for (const message of thread.messages) {
        if (message === null) continue
        if (message.role === "assistant") {
            tokens += assistant_message_to_tokens(message, pretty)
        } else if (message.role === "developer") {
            tokens += developer_message_to_tokens(message, pretty)
        } else if (message.role === "platform") {
            tokens += platform_message_to_tokens(message, pretty)
        } else if (message.role === "context") {
            tokens += context_message_to_tokens(message, pretty)
        } else if (message.role === "user") {
            tokens += user_message_to_tokens(message, pretty)
        }
    }

    return tokens.trimEnd()
}

function assistant_message_to_tokens(message: Assistant, pretty: boolean): string {
    let tokens = ""
    tokens += "<|assistant|>"
    tokens += message.format
    tokens += "<|content|>"
    if (pretty) tokens += "\n"
    tokens += message.content
    if (pretty) tokens += "\n"
    tokens += message.end_turn ? "<|end_turn|>" : ""
    if (pretty && message.end_turn) tokens += "\n"
    if (pretty) tokens += "\n"
    return tokens
}

function developer_message_to_tokens(message: Developer, pretty: boolean): string {
    let tokens = ""
    tokens += "<|developer|>"
    if (pretty) tokens += "\n"
    tokens += message.content
    if (pretty) tokens += "\n"
    if (pretty) tokens += "\n"
    return tokens
}

function platform_message_to_tokens(message: Platform, pretty: boolean): string {
    let tokens = ""
    tokens += "<|platform|>"
    if (pretty) tokens += "\n"
    tokens += message.content
    if (pretty) tokens += "\n"
    if (pretty) tokens += "\n"
    return tokens
}

function context_message_to_tokens(message: Context, pretty: boolean): string {
    let tokens = ""
    tokens += "<|context|>"
    tokens += message.name
    tokens += "<|content|>"
    if (pretty) tokens += "\n"
    tokens += message.content
    if (pretty) tokens += "\n"
    if (pretty) tokens += "\n"
    return tokens
}

function user_message_to_tokens(message: User, pretty: boolean): string {
    let tokens = ""
    tokens += "<|user|>"
    if (pretty) tokens += "\n"
    tokens += message.content
    if (pretty) tokens += "\n"
    if (pretty) tokens += "\n"
    return tokens
}
