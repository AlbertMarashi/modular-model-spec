import { safe_db } from "$lib/stores/database"
import type { Thread } from "./editor_types"


export async function load({  }) {
    const db = await safe_db()
    let [records] = await db.query<[Thread[]]>(`
        SELECT
            *
        FROM thread
    `)

    return {
        records,
    }
}
