import { RecordId } from "surrealdb"
import { customAlphabet } from "nanoid"
import { Type, type ObjectOptions } from "@sinclair/typebox"

// Define the character set and ID length as constants
const SURREAL_ID_CHAR_SET = "abcdefghijklmnopqrstuvwxyz0123456789"
const ID_LENGTH = 20

export type TypedRecordId<Tb extends string, Val extends string = string> = {
    tb: Tb,
    id: Val,
}

export const TypeRecordId = <Tb extends string> (table: Tb, opts?: ObjectOptions) => Type.Object({
    tb: Type.Literal(table),
    id: Type.String(),
}, opts)

const nanoid = customAlphabet(SURREAL_ID_CHAR_SET, ID_LENGTH)

/**
 * Generates a SurrealDB-like Record ID for the given table.
 * @param table The name of the table for which to generate the ID.
 * @returns A SurrealDB-like ID string.
 */
export function gen_surreal_record_id_string(table: string): string {
    return `${table}:${gen_surreal_id_string()}`
}

/**
 * Generates a SurrealDB RecordId object for the given table.
 * @param table The name of the table for which to generate the RecordId.
 * @returns A RecordId object with the table name and a generated SurrealDB-like ID.
 */
export function gen_surreal_record_id_class<Tb extends string>(table: Tb): RecordId<Tb> {
    return new RecordId(table, gen_surreal_id_string())
}

/**
 * Generates a SurrealDB RecordId object for the given table.
 * @param table The name of the table for which to generate the RecordId.
 * @returns A RecordId object with the table name and a generated SurrealDB-like ID.
 */
export function gen_surreal_record<Tb extends string>(table: Tb): TypedRecordId<Tb, string> {
    return {
        tb: table,
        id: gen_surreal_id_string()
    }
}

/**
 * Generates a SurrealDB ID value for records
 */
export function gen_surreal_id_string(): string {
    return nanoid()
}
