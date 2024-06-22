import { alerts_init } from "$lib/stores/alerts"
import { safe_surreal_db_client } from "../surrealdb_client"

export async function load({ data }) {
    const alerts = alerts_init([])
    const db = await safe_surreal_db_client(data.token)

    return {
        db,
        alerts,
        session: data.session
    }
}
