import { new_record, type RecordId } from "$lib/pojo_surreal"
import type { Branch } from "./types"
import { watch } from "runed"
import { tokenize } from "./parser/languages"
import type { Token } from "./parser/types"

type ScoringState = {
    active: undefined | RecordId<"branch">,
    cursor_start: number,
    cursor_end: number,
    thread: RecordId<"thread">,
    branch_map: Record<string, Branch>,
    heirarchy: Branch[],
    chars: string,
    branch_mapping: number[],
    relative_mapping: number[],
    branch_tokens: Array<Array<Token>>
}

export let scoring_state: ScoringState

export function init_scoring_state() {

    const state: ScoringState = $state({
        active: undefined,
        cursor_start: 0,
        cursor_end: 0,
        thread: new_record("thread", "123"),
        branch_map: {},
        chars: "",
        branch_mapping: [],
        relative_mapping: [],
        branch_tokens: [],
        get heirarchy() {
            return traverse_to_root_branch()
        },
    })

    watch(
        () => scoring_state.heirarchy.map(b => b.source),
        sources => update_parse_state(sources.join("")),
    )

    scoring_state = state
}

function update_parse_state(chars: string) {
    const state = scoring_state

    state.chars = chars
    state.branch_mapping = new Array(chars.length).fill(0)
    state.relative_mapping = new Array(chars.length).fill(0)

    let global_index = 0

    for (let b = 0; b < state.heirarchy.length; b++) {
        const branch = state.heirarchy[b]
        for (let rel = 0; rel < branch.source.length; rel++) {
            state.branch_mapping[global_index] = b
            state.relative_mapping[global_index] = rel
            global_index++
        }
    }

    const tokens = tokenize(chars)
    // const tokens = [{ start: 0, len: chars.length, lang: "thread", flags: 0 }]
    const branch_tokens: Array<Array<Token>> = state.heirarchy.map(() => [])

    // Process tokens using the mappings
    for (const token of tokens) {
        let start = token.start
        const end = start + token.len
        let branch = state.branch_mapping[start]
        const end_branch = state.branch_mapping[end]

        // If the token is entirely within one branch, add it directly
        if (branch === end_branch || end_branch === undefined) {
            if (branch === undefined) branch = branch_tokens.length - 1
            branch_tokens[branch].push(token)
            continue
        }

        // If the token spans multiple branches, split it accordingly
        for (let i = start; i <= end; i++) {
            if (!(state.branch_mapping[i] !== branch || i === end)) continue

            // Push token for the previous branch
            branch_tokens[branch].push({ ...token, start, len: i - start })

            // Update the start and branch for the next split segment
            start = i
            branch = state.branch_mapping[i]
        }
    }

    state.branch_tokens = branch_tokens
}

export function traverse_to_root_branch() {
    let current: undefined | RecordId<"branch"> = scoring_state.active

    const thread: Branch[] = []

    while (current) {
        const branch: Branch = scoring_state.branch_map[current.id]

        thread.push(branch)

        current = branch.parent
    }

    return thread.reverse()
}

export function init_branch(content: string): Branch {
    const id = new_record("branch")

    return {
        id,
        metadata: {
            source: {
                type: "human",
                user: new_record("user", "albert"),
            },
        },
        source: content,
        scores: new Array(content.length).fill(0),
        state: {},
        thread: scoring_state.thread,
    }
}

export function branch() {
    const state = scoring_state
    const cursor = Math.min(state.cursor_start, state.cursor_end)
    const branch_index = state.branch_mapping[cursor]
    const relative_index = state.relative_mapping[cursor]
    const original_branch = state.heirarchy[branch_index]

    // 1. Keep bottom half as original branch
    const top_half = original_branch.source.slice(0, relative_index)
    // 2. Create new branch with top half, point to original's parent
    const top_half_branch = init_branch(top_half)

    top_half_branch.scores = original_branch.scores.slice(0, relative_index)
    top_half_branch.parent = original_branch.parent

    // Point original (bottom half) to new top half
    original_branch.parent = top_half_branch.id

    // make original branch only contain the bottom half
    original_branch.source = original_branch.source.slice(relative_index)
    original_branch.scores = original_branch.scores.slice(relative_index)

    // create a new empty branch, pointing to the new top half branch
    const new_branch = init_branch("")
    new_branch.parent = top_half_branch.id

    // add the new top half branch to the branch map
    state.branch_map[top_half_branch.id.id] = top_half_branch
    // add the new empty branch to the branch map
    state.branch_map[new_branch.id.id] = new_branch

    // set the new branch as the active branch
    // state.active = original_branch.id
}

