import { SURREAL_PASS, SURREAL_USER } from "$env/static/private"
import { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { Surreal } from "surrealdb.js"

async function get_surreal_db_client() {
    const db = new Surreal()
    await db.connect(`${PUBLIC_SURREAL_HOST}/rpc`,{
        namespace: PUBLIC_SURREAL_NAMESPACE,
        database: "modular_spec",
        auth: {
            username: SURREAL_USER,
            password: SURREAL_PASS
        },
    })

    return db
}

export const surrealdb_admin = get_surreal_db_client()