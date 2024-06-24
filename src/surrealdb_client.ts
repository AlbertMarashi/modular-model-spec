import { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { Surreal } from "surrealdb.js"

export async function safe_surreal_db_client(token: string | null) {
    const db = new Surreal()

    const surreal_host = new URL(PUBLIC_SURREAL_HOST)

    if (surreal_host.protocol === "http:") surreal_host.protocol = "ws:"
    if (surreal_host.protocol === "https:") surreal_host.protocol = "wss:"
    surreal_host.pathname = "/rpc"
    await db.connect(surreal_host, {
        namespace: PUBLIC_SURREAL_NAMESPACE,
        database: "modular_spec",
        auth: token ?? undefined,
        versionCheck: false,
    })

    return db
}