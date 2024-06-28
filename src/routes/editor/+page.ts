import type { Thread } from "./editor_types"


export async function load({ parent }) {
    let data = await parent()

    let [records] = await data.db.query<[Thread[]]>(`
        SELECT
            *
        FROM thread
    `)

    return {
        records,
    }
}