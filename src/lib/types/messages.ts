export type Thread = (Message | Thread | Thread[])[]

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

// Contexts are message types that the developer can use to provide contextual information to the model.
// Context contents are treated as information rather than instructions, except where specified by the developer.
export type Context = {
    role: "context"
    // optional name of the context, so it can be referred to in the developer message
    name: string | null
    // Data returned from a tool
    content: string
}