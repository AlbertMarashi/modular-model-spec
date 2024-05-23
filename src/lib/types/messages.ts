export type Thread = (Message | Thread | Thread[])[]

export type Message =
    | Assistant
    | Developer
    | Platform
    | User
    | Tool

/* an LLM generated response */
export type Assistant = {
    role: "assistant"
    // the response format or recipient of a tool
    format: string
    content: string
    // whether this assistant ended it's turn
    end_turn: boolean,
    correct?: boolean,
    halted_on_completion?: boolean
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

/**
 * Generated response data from the LLM-augmented system (developer or platform)
 */
export type Tool = {
    role: "tool"
    // Data returned from a tool
    content: string
}