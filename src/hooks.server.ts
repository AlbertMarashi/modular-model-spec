import { handle as auth_handler } from "./auth"
import { safe_request_wrapper } from "safe-ssr/safe_request_wrapper"
import { sequence } from "@sveltejs/kit/hooks"
import { PUBLIC_SURREAL_NAMESPACE } from "$env/static/public"
import { sign_jwt } from "$lib/utils/jwt"
import { RecordId } from "surrealdb"
import type { Handle } from "@sveltejs/kit"
import type { TypedSurreal } from "$lib/queries"
import { init_surreal_client } from "$lib/stores/database"
import { request_symbol } from "safe-ssr"
import { server_request_data } from "$lib/stores/request"

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

export const request_data_initaliser: Handle = async ({ event, resolve }) => {
    let db: Promise<TypedSurreal> | undefined


    server_request_data.set(request_symbol.current(), {
        db: () => db ??= init_surreal_client( event.locals.token || undefined),
        event,
    })

    return await resolve(event)
}


async function token_data({
    event, resolve
}: Parameters<typeof handle>[0]) {
    /** @todo: can we move to our own custom auth handler? **/
    const session = await event.locals.auth()
    const user_id = session?.user?.id

    /** @todo: Should we be generating this every time? */
    /// This is the database authentication token
    /// We use it to authenticate the user to the database
    const token = user_id
        ? await sign_jwt({
            ns: PUBLIC_SURREAL_NAMESPACE,
            db: "modular_model_spec",
            id: new RecordId("user", user_id),
            ac: "users"
        })
        : null

    if(token) {
        event.cookies.set("token", token, {
            path: "/",
            httpOnly: false,
            sameSite: "strict",
            domain: event.url.hostname,
        })
    } else {
        event.cookies.delete("token", {
            path: "/",
            httpOnly: false,
            sameSite: "strict",
            domain: event.url.hostname,
        })
    }
    event.locals.session = session
    event.locals.token = token

    return resolve(event)
}


export const handle = sequence(
    /**
     * Handles the sequence of middleware functions for processing requests.
     *
     * - `auth_handler`: Manages authentication for incoming requests.
     * - `safe_request_wrapper`: Associates a unique request symbol with the request, allowing for safe access to request-specific data.
     * - `token_data`: Attaches user session and token information to the request event.
     * - `request_data_initaliser`: Creates a server-side request-isolated data that can be accessed globally
     */
    auth_handler,
    safe_request_wrapper,
    token_data,
    request_data_initaliser,
)
