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


export function thread_to_tokens(thread: Thread): string {
    let tokens = ""

    for (const message of thread.messages) {
        if (message === null) continue
        if (message.role === "assistant") {
            tokens += assistant_message_to_tokens(message)
        } else if (message.role === "developer") {
            tokens += developer_message_to_tokens(message)
        } else if (message.role === "platform") {
            tokens += platform_message_to_tokens(message)
        } else if (message.role === "context") {
            tokens += context_message_to_tokens(message)
        } else if (message.role === "user") {
            tokens += user_message_to_tokens(message)
        }
    }

    return tokens
}

function assistant_message_to_tokens(message: Assistant): string {
    let tokens = ""
    tokens += "<|assistant|>"
    tokens += message.format
    tokens += "<|content|>"
    tokens += message.content
    tokens += message.end_turn ? "<|end_turn|>" : ""
    return tokens
}

function developer_message_to_tokens(message: Developer): string {
    let tokens = ""
    tokens += "<|developer|>"
    tokens += message.content
    return tokens
}

function platform_message_to_tokens(message: Platform): string {
    let tokens = ""
    tokens += "<|platform|>"
    tokens += message.content
    return tokens
}

function context_message_to_tokens(message: Context): string {
    let tokens = ""
    tokens += "<|context|>"
    tokens += message.name
    tokens += "<|content|>"
    tokens += message.content
    return tokens
}

function user_message_to_tokens(message: User): string {
    let tokens = ""
    tokens += "<|user|>"
    tokens += message.content
    return tokens
}