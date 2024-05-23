import { alerts_init } from "$lib/stores/alerts"

export async function load() {
    const alerts = alerts_init([])
    return {
        alerts,
    }
}
