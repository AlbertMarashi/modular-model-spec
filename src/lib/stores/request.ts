import { request_symbol } from "safe-ssr"
import type { RequestEvent } from "@sveltejs/kit"
import type { TypedSurreal } from "$lib/queries"

// We use a WeakMap, so that the request data is
// garbage collected after the request is complete.
export const server_request_data = new WeakMap<symbol, {
    event: RequestEvent
    db: () => Promise<TypedSurreal>
}>()

export const request_data_store = {
    get request_data() {
        const sym = request_symbol.current()

        const request_data = server_request_data.get(sym)

        if(!request_data) throw new Error("No request data found for symbol")

        return request_data
    }
}
