import { new_record, type RecordId } from "$lib/pojo_surreal"
import type { Branch } from "./types"
import { watch } from "runed"
import { tokenize } from "./parser/languages"
import type { Token } from "./parser/types"
import type { Connection } from "./tree/connection"

type ScoringState = {
    active: undefined | string,
    cursor_start: number,
    cursor_end: number,
    thread: RecordId<"thread">,
    branch_map: Record<string, Branch>,
    heirarchy: string[],
    chars: string,
    branch_mapping: number[],
    relative_mapping: number[],
    branch_tokens: Array<Array<Token>>,
    connections: Connection[],
    layouts: BranchLayout[],
    dragging: boolean,
    cursor_min: number,
    cursor_max: number,
    branch_to_children: Record<string, string[]>,
}

// export type RenderRow = RenderToken[]
export type BranchLayout = RenderToken[]

export type RenderToken = {
    start: number,
    text: string,
    len: number,
    token: Token,
    branch: number,
    rel_start: number,
}

export let scoring_state: ScoringState

export function init_scoring_state() {

    const state: ScoringState = $state({
        active: undefined,
        cursor_start: 5,
        cursor_end: 5,
        thread: new_record("thread", "123"),
        branch_map: {},
        chars: "",
        branch_mapping: [],
        relative_mapping: [],
        branch_tokens: [],
        connections: [],
        layouts: [],
        get heirarchy() {
            return traverse_to_root_branch()
        },
        dragging: false,
        cursor_min: 0,
        cursor_max: 0,
        branch_to_children: {},
    })

    watch(
        () => scoring_state.heirarchy.map(b => state.branch_map[b].source),
        compute_layout_map
    )

    $effect(() => {
        state.cursor_min = Math.min(state.cursor_start, state.cursor_end)
        state.cursor_max = Math.max(state.cursor_start, state.cursor_end)
    })

    watch(() => Object.keys(state.branch_map), children => {
        state.branch_to_children = {}
        state.connections = []
        for (const key of children) {
            const branch = state.branch_map[key]
            if (branch.parent) {
                const parent = branch.parent.id
                state.branch_to_children[parent] ??= []
                state.branch_to_children[parent].push(branch.id.id)
            }
        }
        for (const key of children) {
            const branch = state.branch_map[key]
            if (branch.parent) {
                state.connections.push({ from: { id: branch.id.id, side: "top" }, to: { id: branch.parent.id, side: "bottom" } })
            }
        }
    })

    watch(() => scoring_state.heirarchy, branches => {
        for (const id of branches) {
            const branch = scoring_state.branch_map[id]
            console.log(branch.source.length, branch.scores.length)
        }
    })

    scoring_state = state
}


function compute_layout_map(sources: string[]) {
    const chars = sources.join("")
    const layouts: BranchLayout[] = []

    let rel_index = 0
    let char_index = 0

    let current_branch: RenderToken[] = []

    function consume_token(token: Token, len: number) {
        const BRANCH_LEN = sources[layouts.length - 1].length
        const BRANCH_DIFF = (BRANCH_LEN - rel_index)

        if (BRANCH_LEN === 0) {
            new_branch()
            return consume_token(token, len)
        }

        // Check if this token spans across multiple branches
        if (BRANCH_DIFF < len) {
            // consume the amount of token we can from the current branch
            if (BRANCH_DIFF > 0) consume_token(token, BRANCH_DIFF)
            // then, create a new branch to consume the rest
            new_branch()
            // consume the rest of the token, which may include additional branches
            return consume_token(token, len - BRANCH_DIFF)
        }


        const text = chars.slice(char_index, char_index + len)

        current_branch.push({
            start: char_index,
            text,
            len,
            token,
            branch: layouts.length - 1,
            rel_start: rel_index,
        })

        rel_index += len
        char_index += len
    }


    function new_branch() {
        current_branch = []
        layouts.push(current_branch)
        rel_index = 0
    }

    const tokens = tokenize(chars).map(t => ({ text: chars.slice(t.start, t.start + t.len), ...t}))
    
    new_branch()

    for (const token of tokens) {
        consume_token(token, token.len)
    }

    

    const branch_mapping = new Array(chars.length).fill(0)
    const relative_mapping = new Array(chars.length).fill(0)

    let global_index = 0

    for (let b = 0; b < sources.length; b++) {
        for (let rel = 0; rel < sources[b].length; rel++) {
            branch_mapping[global_index] = b
            relative_mapping[global_index] = rel
            global_index++
        }
    }

    scoring_state.layouts = layouts
    scoring_state.chars = chars
    scoring_state.branch_mapping = branch_mapping
    scoring_state.relative_mapping = relative_mapping
}


export function traverse_to_root_branch() {
    let current: undefined | string = scoring_state.active

    const thread: string[] = traverse_down(current!)

    while (current) {
        const branch: Branch = scoring_state.branch_map[current]

        thread.push(branch.id.id)

        current = branch.parent?.id
    }

    return thread.reverse()
}

export function traverse_down(branch: string) {
    const children: string[] = []

    while (scoring_state.branch_to_children[branch]) {
        const child = scoring_state.branch_to_children[branch]?.[0]
        if (!child) break
        children.push(child)
        branch = child
    }

    return children.reverse()
}

export function init_branch(content: string = ""): Branch {
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

export function branch_at_cursor() {
    const state = scoring_state
    const cursor = Math.min(state.cursor_start, state.cursor_end)
    const branch_index = state.branch_mapping[cursor]
    const relative_index = state.relative_mapping[cursor]
    const original_branch = state.branch_map[state.heirarchy[branch_index]]

    branch_at_index(original_branch, relative_index)
}


export function branch_at_index(original: Branch, relative_index: number) {
    const state = scoring_state

    // If the relative index is at the end of the branch
    // then, we need to create a new branch and point it to the original branch
    if (relative_index === original.source.length - 1) {
        const new_branch = init_branch()
        new_branch.parent = original.id
        state.branch_map[new_branch.id.id] = new_branch
        state.active = new_branch.id.id
        return
    }

    // If the relative index is at the beginning, and we have a parent,
    // then we can create a branch, and point it to the original branch's parent
    if (relative_index === 0 && original.parent) {
        const new_branch = init_branch()
        new_branch.parent = original.parent
        state.branch_map[new_branch.id.id] = new_branch
        state.active = new_branch.id.id
        return
    }

    // Create new branch with top part, point to original's parent
    const top_half = original.source.slice(0, relative_index)
    const top_half_branch = init_branch(top_half)
    top_half_branch.scores = original.scores.slice(0, relative_index)
    top_half_branch.parent = original.parent

    // add the new top half branch to the branch map
    state.branch_map[top_half_branch.id.id] = top_half_branch
    
    // make original branch only contain the bottom half
    original.source = original.source.slice(relative_index)
    original.scores = original.scores.slice(relative_index)

    // Point original (bottom part) to new top part
    original.parent = top_half_branch.id

    state.active = top_half_branch.id.id

    
    // create a new empty branch, pointing to the new top branch
    // const new_branch = init_branch("")
    // new_branch.parent = top_half_branch.id
    
    // add the new empty branch to the branch map
    // state.branch_map[new_branch.id.id] = new_branch
    
    // set the new branch as the active branch
    // state.active = new_branch.id.id
}