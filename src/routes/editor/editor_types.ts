import type { Assistant, Context, Developer, Message, Platform, User } from "$lib/types/messages"

export type Thread = {
    allowed_formats: Array<AllowedAssistantFormat>
    messages: Array<Message | null>
}

export type AllowedAssistantFormat = {
    name: string
    halt_on_start: boolean
    halt_on_completion: boolean
    sampler: "json" | null
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