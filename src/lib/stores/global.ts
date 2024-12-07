import type { RecordId } from "$lib/pojo_surreal"
import { set_cookie } from "$lib/utils/cookie"
import { safe_state } from "safe-ssr"

export type Message = {
    message: string,
    code: string | undefined,
    type: "error" | "success" | "warning" | "info"
}

export type CheckoutData = {
    org_id: RecordId<"organisation">
}

export const global_state = safe_state<{
    /**
     * Indicates whether the application is in a global state.
     * Used to show the global loading scrim `OverlayLoading.svelte`
     * in the root layout.
     */
    loading: boolean
    /**
    * Indicates whether the application is in light or dark mode.
    */
    light_mode: boolean
    /**
     * An array of alert messages to be displayed to the user.
     * They disappear after some time.
     */
    alerts: Message[]
    /**
     * When this value is set, the checkout form will be rendered with the given data.
     *
     * See `StripeFlow.svelte`.
     */
    checkout_data: CheckoutData | null
    /**
     * Used to render a node that follows the user's cursor
     *
     * @see `DragNodeRenderer.svelte`
     */
    drag_state: {
        node: Node,
        scale?: number
    } | null
}>("global_state", {
    loading: false,
    light_mode: false,
    alerts: [],
    checkout_data: null,
    drag_state: null
})

export function create_alert (type: Message["type"], alert: string | Error | unknown | App.Error): void {
    let message: string = ""
    let code: string | undefined
    if (typeof alert === "object" && alert !== null && "message" in alert && typeof alert.message === "string") {
        if("message" in alert && typeof alert.message === "string") message = alert.message
        if("code" in alert && typeof alert.code === "string") code = alert.code
    }
    else if (typeof alert !== "string") message = `An unknown error occurred: ${JSON.stringify(alert)}`
    else message = alert

    global_state.inner.alerts.push({
        code,
        message,
        type
    })
}

export function toggle_theme() {
    global_state.inner.light_mode = !global_state.inner.light_mode
    set_cookie("light_mode", global_state.inner.light_mode ? "true" : "false")
}
