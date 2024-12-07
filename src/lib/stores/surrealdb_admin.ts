import {SURREAL_PASS, SURREAL_USER} from "$env/static/private"
import type { TypedSurreal } from "$lib/queries"
import { init_surreal_client } from "$lib/stores/database"


let db_cache: Promise<TypedSurreal>

export async function get_surrealdb_admin() {
    if(!db_cache) {
        db_cache = init_surrealdb_admin()
        return db_cache
    } else {
        return db_cache
    }
}


async function init_surrealdb_admin() {
    return await init_surreal_client({
        username: SURREAL_USER,
        password: SURREAL_PASS,
    })
}
