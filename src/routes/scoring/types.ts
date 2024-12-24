import type { RecordId } from "$lib/pojo_surreal"
import type { Token } from "./parser/types"


export type TrainingThread = {
    user: RecordId<"user">
    id: string
    created: Date,
    formats: Format[]
}

export type Format = {
    name: string
}

export type Branch = {
    thread: RecordId<"thread">
    id: RecordId<"branch">
    parent?: RecordId<"branch">
    note?: string
    source: string
    scores: number[]
    state: { [key: string]: unknown }
    metadata: BranchMetadata
    truncation?: TruncationWindow
}

export type TruncationWindow = {
    start: number
    end: number
}

export type BranchMetadata = {
    source: Source
}

export type Source = HumanSource | ModelSource | ToolSource

export type HumanSource = {
    type: "human"
    user: RecordId<"user">
}

export type ModelSource = {
    type: "model"
    // things like the model, temperature, prompt, etc...
    body: Record<string, unknown>
}

export type ToolSource = {
    type: "tool"
    name: string
    // potentially the JS source code that was used to produce the output?..
    // code: string
}