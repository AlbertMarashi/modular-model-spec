import { read } from "$app/server"
// import { parse } from "svelte-parse"
import { parse } from "svelte/compiler"
export async function load() {
    const spec = await read("../spec/spec.md").text()

    // const ast = parse({
    //     value: spec,
    //     generatePositions: false,
    // })

    // const svelte_parse = parse(spec)

    // console.log(svelte_parse)

    return {
        // ast:
        spec,
    }
}