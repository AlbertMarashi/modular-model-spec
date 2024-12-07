import { browser } from "$app/environment"
import { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { TypedSurreal } from "$lib/queries"
import { get_cookie_from_document } from "$lib/utils/cookie"
import { request_data_store } from "./request"

// This will only be set in the browser
const client_db = browser
    ? init_surreal_client(get_cookie_from_document("token") || undefined)
    : null

export async function safe_db(): Promise<TypedSurreal> {
    if (browser) {
        return await client_db!
    } else {
        // otherwise load the DB from the request data store
        return request_data_store.request_data.db()
    }
}

export async function init_surreal_client(
    auth?:
    | string
    | {
        username: string,
        password: string
    },
) {
    const db = new TypedSurreal()

    const surreal_host = new URL(PUBLIC_SURREAL_HOST)

    if (surreal_host.protocol === "http:") surreal_host.protocol = "ws:"
    if (surreal_host.protocol === "https:") surreal_host.protocol = "wss:"
    surreal_host.pathname = "/rpc"

    await db.connect(surreal_host, {
        namespace: PUBLIC_SURREAL_NAMESPACE,
        database: "modular_model_spec",
        auth
    })

    return db
}
