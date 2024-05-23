import { read } from "$app/server"
export async function load() {
    const spec = await read("../src/spec.md").text()

    return {
        spec,
    }
}