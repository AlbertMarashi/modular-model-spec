 
import type { AlertsStore } from "$lib/stores/alerts"
import type { Surreal } from "surrealdb"
import type { Session } from "@auth/core/types"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Platform {}

		interface Locals {
			// Returns a safe client-authenticated SurrealDB
			db: () => Promise<Surreal>
			// Authenticated session
			session: Session | null
			token: string | null
		}

		interface PageData {
			// Safe client-authenticated SurrealDB
			db: Surreal;
            alerts: AlertsStore;
			session?: Session | null
		}

		interface Error {
            code?: string;
            cause?: Error;
            message: string;
            stack?: string;
        }
	}
}


declare module "@auth/sveltekit" {
    interface User {
        id: string
        name: string
        email: string
        image?: string,
        provider?: string,
    }

    interface Session {
        user: User
        expires: string
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string
        email: string
        name: string
        image?: string
    }
}

export {}
