import { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { Surreal } from "surrealdb.js"

export async function safe_surreal_db_client(token: string | null) {
    const db = new Surreal()

    await db.connect(`${PUBLIC_SURREAL_HOST}/rpc`, {
        namespace: PUBLIC_SURREAL_NAMESPACE,
        database: "modular_spec",
        auth: token ?? undefined,
        versionCheck: false,
    })

    return db
}