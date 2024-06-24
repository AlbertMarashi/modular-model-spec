import { handle as auth_handler } from "./auth"
import { safe_surreal_db_client } from "./surrealdb_client"
import { PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { sign_jwt } from "$lib/utils/jwt"
import { sequence } from "@sveltejs/kit/hooks"

export const handle = sequence(
    auth_handler,
    token_data,
    setup_client_db,
)

export async function handleError({ error }) {
    console.error(error)

    if(!error) return {
        message: "Internal server error",
        code: "unknown_code",
    }

    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (error as any)?.message ?? "Internal server error",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code: (error as any)?.code ?? "unknown_code",
    }
}


async function setup_client_db({ event, resolve }: Parameters<typeof handle>[0]) {
    event.locals.db = async () => await safe_surreal_db_client(event.locals.token)
    return resolve(event)
}

async function token_data({ event, resolve }: Parameters<typeof handle>[0]) {
    const session = await event.locals.auth()
    const user_id = session?.user?.id

    /// TODO: Should we be generating this every time?
    /// This is the database authentication token
    /// We use it to authenticate the user to the database
    const token = user_id
        ? await sign_jwt({
            ns: PUBLIC_SURREAL_NAMESPACE,
            id: user_id,
            db: "modular_spec",
            tk: "modular_token",
            sc: "users",
        })
        : null

    event.locals.session = session
    event.locals.token = token

    return resolve(event)
}
