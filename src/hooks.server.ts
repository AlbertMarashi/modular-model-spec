import { handle as auth_handler } from "./auth"
import { safe_surreal_db_client } from "./surrealdb_client"
import { surrealdb_admin } from "./surrealdb_admin"
import { PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { sign_jwt } from "$lib/utils/jwt"

export async function handle({ event, resolve }) {
    event.locals.admin_db = await surrealdb_admin

    const new_resolve = async (e: typeof event) => {
        await token_data(e.locals)
        e.locals.db = async () => await safe_surreal_db_client(event.locals.token)
        return resolve(e)
    }

    return await auth_handler({ event, resolve: new_resolve })
}

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

async function token_data(locals: App.Locals) {
    const session = await locals.auth()
    const user_id = session?.user?.id

    /// TODO: Should we be generating this every time?
    /// This is the database authentication token
    /// We use it to authenticate the user to the database
    const token = user_id
        ? await sign_jwt({
            ns: PUBLIC_SURREAL_NAMESPACE,
            id: user_id,
            db: "modular-model-spec",
            tk: "modular_token",
            sc: "users",
        })
        : null

    locals.session = session
    locals.token = token
}