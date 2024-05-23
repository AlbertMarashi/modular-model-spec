import type { Writable } from "svelte/store"
import { writable } from "svelte/store"

export type AlertsStore = {
    create_alert: (type: Message["type"], message: string | Error | unknown) => void,
    store: Writable<Message[]>
}

export type Message = {
    id: symbol,
    message: string,
    code: string | undefined,
    type: "error" | "success" | "warning" | "info"
}

export const alerts_init = (messages: Message[]): AlertsStore => {
    const store = writable(messages)

    return {
        store,
        create_alert (type: Message["type"], error: string | Error | unknown | App.Error) {
            let message: string
            let code: string | undefined
            if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
                if("message" in error && typeof error.message === "string") message = error.message
                if("code" in error && typeof error.code === "string") code = error.code
            }
            else if (typeof error !== "string") message = `An unknown error occurred: ${JSON.stringify(error)}`
            else message = error

            store.update(messages => {
                messages.push({
                    id: Symbol(),
                    code,
                    message,
                    type
                })

                return messages
            })
        }
    }
}