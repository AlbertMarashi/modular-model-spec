import { type RecordId, Surreal } from "$lib/pojo_surreal"

export type Queries = {
    [CreateProviderUserQuery]: {variables: CreateProviderUserVariables, result: CreateProviderUserResult }
    [CreateUserAccountQuery]: {variables: CreateUserAccountVariables, result: CreateUserAccountResult }
    [GetUserFromEmailQuery]: {variables: GetUserFromEmailVariables, result: GetUserFromEmailResult }
    [GetUserFromProviderQuery]: {variables: GetUserFromProviderVariables, result: GetUserFromProviderResult }
    [UpdateUserQuery]: {variables: UpdateUserVariables, result: UpdateUserResult }
    [UpdateUserEmailQuery]: {variables: UpdateUserEmailVariables, result: UpdateUserEmailResult }
    [UpsertThreadQuery]: {variables: UpsertThreadVariables, result: UpsertThreadResult }
}
/**
 * ## CreateProviderUser query results:
 * 
 * ```surql
 * /// ---------------------
 * /// Result 0:
 * /// ---------------------
 * {
 *     id: record<user>
 * }
 * ```
 */
export const CreateProviderUserQuery = "CREATE ONLY user CONTENT $user RETURN id;"
export type CreateProviderUserResult = [
    {
        id: (RecordId<"user"> & { id: string }),
    }
]
export type CreateProviderUserVariables = {
    user: (
        | {
            created_at?: Date,
            email: string,
            id?: (RecordId<"user"> & { id: string }),
            image?: string,
            name: string,
            password?: string,
        }
        | Array<{
            created_at?: Date,
            email: string,
            id?: (RecordId<"user"> & { id: string }),
            image?: string,
            name: string,
            password?: string,
        }>
    ),
}
/**
 * ## CreateUserAccount query results:
 * 
 * ```surql
 * /// ---------------------
 * /// Result 0:
 * /// ---------------------
 * {
 *     id: record<account>,
 *     provider: string,
 *     provider_id: string,
 *     user: record<user>
 * }
 * ```
 */
export const CreateUserAccountQuery = "CREATE ONLY account CONTENT { provider: $provider, provider_id: $provider_id, user: $user_id };"
export type CreateUserAccountResult = [
    {
        id: (RecordId<"account"> & { id: string }),
        provider: string,
        provider_id: string,
        user: (RecordId<"user"> & { id: string }),
    }
]
export type CreateUserAccountVariables = {
    provider: string,
    provider_id: string,
    user_id: (RecordId<"user"> & { id: string }),
}
/**
 * ## GetUserFromEmail query results:
 * 
 * ```surql
 * /// ---------------------
 * /// Result 0:
 * /// ---------------------
 * array<{
 *     id: record<user>,
 *     name: string
 * }>
 * ```
 */
export const GetUserFromEmailQuery = "SELECT id, name FROM user WHERE email = string::lowercase($email);"
export type GetUserFromEmailResult = [
    Array<{
        id: (RecordId<"user"> & { id: string }),
        name: string,
    }>
]
export type GetUserFromEmailVariables = {
    email: string,
}
/**
 * ## GetUserFromProvider query results:
 * 
 * ```surql
 * /// ---------------------
 * /// Result 0:
 * /// ---------------------
 * array<{
 *     id: record<account>,
 *     user: record<user>
 * }>
 * ```
 */
export const GetUserFromProviderQuery = "SELECT id, user FROM account WHERE provider_id = $provider_id AND provider = $provider LIMIT 1;"
export type GetUserFromProviderResult = [
    Array<{
        id: (RecordId<"account"> & { id: string }),
        user: (RecordId<"user"> & { id: string }),
    }>
]
export type GetUserFromProviderVariables = {
    provider: string,
    provider_id: string,
}
/**
 * ## UpdateUser query results:
 * 
 * ```surql
 * /// ---------------------
 * /// Result 0:
 * /// ---------------------
 * array<{
 *     created_at: datetime,
 *     email: string,
 *     id: record<user>,
 *     image: option<string>,
 *     name: string,
 *     password: option<string>,
 *     updated_at: datetime
 * }>
 * ```
 */
export const UpdateUserQuery = "UPDATE $user SET name = $name, email = $email, image = $image;"
export type UpdateUserResult = [
    Array<{
        created_at: Date,
        email: string,
        id: (RecordId<"user"> & { id: string }),
        image?: string,
        name: string,
        password?: string,
        updated_at: Date,
    }>
]
export type UpdateUserVariables = {
    email: string,
    image?: string,
    name?: string,
    user: (RecordId<"user"> & { id: string }),
}
/**
 * ## UpdateUserEmail query results:
 * 
 * ```surql
 * /// ---------------------
 * /// Result 0:
 * /// ---------------------
 * array<{
 *     created_at: datetime,
 *     email: string,
 *     id: record<user>,
 *     image: option<string>,
 *     name: string,
 *     password: option<string>,
 *     updated_at: datetime
 * }>
 * ```
 */
export const UpdateUserEmailQuery = "UPDATE $user_id SET email = $email;"
export type UpdateUserEmailResult = [
    Array<{
        created_at: Date,
        email: string,
        id: (RecordId<"user"> & { id: string }),
        image?: string,
        name: string,
        password?: string,
        updated_at: Date,
    }>
]
export type UpdateUserEmailVariables = {
    email: string,
    user_id: (RecordId<"user"> & { id: string }),
}
/**
 * ## UpsertThread query results:
 * 
 * ```surql
 * /// ---------------------
 * /// Result 0:
 * /// ---------------------
 * array<{
 *     allowed_formats: any,
 *     created_at: datetime,
 *     id: record<thread>,
 *     messages: any,
 *     tags: array<string>,
 *     updated_at: datetime,
 *     user: record<user>
 * }>
 * ```
 */
export const UpsertThreadQuery = "UPSERT thread CONTENT $thread;"
export type UpsertThreadResult = [
    Array<{
        allowed_formats: any,
        created_at: Date,
        id: (RecordId<"thread"> & { id: string }),
        messages: any,
        tags: Array<string>,
        updated_at: Date,
        user: (RecordId<"user"> & { id: string }),
    }>
]
export type UpsertThreadVariables = {
    thread: (
        | {
            allowed_formats: any,
            created_at?: Date,
            id?: (RecordId<"thread"> & { id: string }),
            messages: any,
            tags?: Array<string>,
            user?: (RecordId<"user"> & { id: string }),
        }
        | Array<{
            allowed_formats: any,
            created_at?: Date,
            id?: (RecordId<"thread"> & { id: string }),
            messages: any,
            tags?: Array<string>,
            user?: (RecordId<"user"> & { id: string }),
        }>
    ),
}


export type Variables<Q extends keyof Queries> = Queries[Q]["variables"] extends never ? [] : [Queries[Q]["variables"]]

/**
 * A Surreal client with typed queries from codegen.
 *
 * Usage:
 *
 * ```surql
 * // [your_schema_path].surql
 * DEFINE TABLE user SCHEMAFULL;
 * DEFINE FIELD name ON user TYPE string;
 * ```
 * ```surql
 * // queries/get_user.surql
 * SELECT * FROM ONLY $auth;
 * ```
 *
 * ```ts
 * // usage example
 * import { TypedSurreal, GetUserQuery } from "[YOUR_OUTPUT_PATH].ts"
 * const db = new TypedSurreal()
 *
 * await db.connect(...)
 *
 * const [
 *     user // { id: RecordId<"user">, name: string }
 * ] = await surreal.typed(GetUserQuery)
 *
 * console.log(user) // { id: 1, name: "John Doe" }
 * ```
 */
export class TypedSurreal extends Surreal {
    typed<Q extends keyof Queries>(query: Q, ...rest: Variables<Q>): Promise<Queries[Q]["result"]> {
        return this.query(query, rest[0])
    }
}
