import {
    RecordId as BaseRecordId, Surreal as BaseSurreal, type Prettify, type QueryParameters, type RecordIdValue
} from "surrealdb"

export interface RecordId<Tb extends string = string> {
    tb: Tb
    id: string
}

export function new_record<Tb extends string>(tb: Tb, id: string): RecordId<Tb> {
    return {
        tb,
        id
    }
}

export class Surreal extends BaseSurreal {
    async query<T extends unknown[]>(...args: QueryParameters): Promise<Prettify<T>> {
        if (args[1] instanceof Array) return this.convert_to_record_id(await super.query(...args)) as unknown as Promise<Prettify<T>>
        if (args[1]) args[1] = this.convert_to_record_id_class(args[1]) as Record<string, unknown>
        return this.convert_to_record_id(await super.query(...args)) as unknown as Promise<Prettify<T>>
    }

    private convert_to_record_id(value: unknown): unknown {
        if (value instanceof BaseRecordId) {
            return {
                tb: value.tb,
                id: this.convert_to_record_id(value.id),
            }
        }

        // if (Array.isArray(value)) return value.map(this.convert_to_record_id)
        if (value instanceof Date) return value
        if (typeof value === "object" && value !== null) {
            for (const [key, val] of Object.entries(value)) {
                (value as Record<string, unknown>)[key] = this.convert_to_record_id(val)
            }
            return value
        }
        return value
    }

    private convert_to_record_id_class(value: unknown): unknown {
        if (value instanceof BaseRecordId) return value
        if (Array.isArray(value)) return value.map(v => this.convert_to_record_id_class(v))
        if (value instanceof Date) return value
        if (typeof value === "object" && value !== null ) {
            if (is_record_id(value)) return new BaseRecordId(value.tb, this.convert_to_record_id(value.id) as RecordIdValue)
            const obj: Record<string, unknown> = {}
            for (const [key, val] of Object.entries(value)) {
                obj[key] = this.convert_to_record_id_class(val)
            }
            return obj
        }
        return value
    }
}

function is_record_id_value(id: unknown): id is RecordIdValue {
    if (typeof id === "string") return true
    if (typeof id === "number") return true
    if (typeof id === "boolean") return true
    if (typeof id === "bigint") return true
    if (Array.isArray(id)) return true
    if (typeof id === "object" && id !== null) return true
    return false
}

function is_record_id(value: unknown): value is RecordId<string> {
    if (
        typeof value === "object"
        && value !== null
        && "tb" in value
        && typeof value.tb === "string"
        && "id" in value
        && is_record_id_value(value.id)
    ) {
        return true
    }
    return false
}


export function record_to_string(record: RecordId<string> & { id: string }): string {
    return `${record.tb}:${record.id}`
}
