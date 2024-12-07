import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from "$env/static/private"
import GitHub from "@auth/core/providers/github"
import { SvelteKitAuth } from "@auth/sveltekit"
import {
    CreateProviderUserQuery,
    CreateUserAccountQuery, GetUserFromEmailQuery, GetUserFromProviderQuery, UpdateUserEmailQuery,
    UpdateUserQuery
} from "$lib/queries"
import { get_surrealdb_admin } from "$lib/stores/surrealdb_admin"



export const {
    handle, signIn, signOut
} = SvelteKitAuth({
    callbacks: {
        async signIn({
            user, account
        }) {
            const sdb = await get_surrealdb_admin()
            // If we're signing into a non-credentials provider, we need to ensure the account exists in the database
            // if not, we will create the account and user
            if (user && account && account.provider !== "credentials") {
                // return true

                // Cases
                // 1. User exists in the database with the same email address and has an account with the provider
                // 2. User exists in the database with the same email address but does not have an account with the provider
                // 3. User does not exist in the database with the same email address
                // 4. The account exists, but it's email has changed, we should update the user's email address
                // 5. Both exist, so we should update user settings

                // A user might exist in the database with the same email address, but not have an account with the provider
                // we first need to check if the user with the email address exists
                const [[existing_user]] = await sdb.typed(
                    GetUserFromEmailQuery,
                    { email: user.email! }
                )

                // Check if the account exists
                const [[existing_account]] = await sdb.typed(
                    GetUserFromProviderQuery,
                    {
                        provider_id: account.providerAccountId,
                        provider: account.provider,
                    })

                if (existing_account && !existing_user && user.email) {
                    // If the account exists, but the user does not, that means we need to update the user's email address
                    await sdb.typed(
                        UpdateUserEmailQuery,
                        {
                            email: user.email,
                            user_id: existing_account.user
                        }
                    )
                } else if (existing_user && !existing_account) {
                    // If the user exists, but the account does not, that means we need to create the account
                    // and link it to the user
                    await sdb.typed(
                        CreateUserAccountQuery,
                        {
                            user_id: existing_user.id,
                            provider_id: account.providerAccountId,
                            provider: account.provider,
                        }
                    )
                } else if (!existing_user && !existing_account) {
                    // If the user does not exist, we need to create the user and the account
                    const [new_user] = await sdb.typed(
                        CreateProviderUserQuery,
                        {
                            user: {
                                name: user.name!,
                                email: user.email!,
                                image: user.image ?? undefined,
                            }
                        })

                    await sdb.typed(
                        CreateUserAccountQuery,
                        {
                            user_id: new_user.id,
                            provider_id: account.providerAccountId,
                            provider: account.provider,
                        }
                    )
                } else if (existing_user && existing_account) {
                    // If both the user and the account exist, we need to update the user's settings
                    await sdb.typed(
                        UpdateUserQuery,
                        {
                            user: existing_user.id,
                            name: user.name ?? undefined,
                            email: user.email!,
                            image: user.image ?? undefined,
                        }
                    )
                }
            }

            return true
        },
        async jwt({
            token, user, account, profile
        }) {
            // if there is a profile, that means the user is signing in
            // through a provider, so we must retrieve the user's information
            // via it's account through the sub field
            if(profile && account) {
                const sdb = await get_surrealdb_admin()
                const [[account_result]] = await sdb.typed(
                    GetUserFromProviderQuery,
                    {
                        provider_id: account.providerAccountId,
                        provider: account.provider,
                    }
                )
                if (!user) throw new Error("User not found")
                user.id = account_result.user.id
                user.provider = account.provider
            }
            if(user) {
                token = {
                    id: user.id!,
                    email: user.email as string,
                    name: user.name as string,
                    image: user.image as string | undefined,
                    provider: user.provider as string | undefined,
                }
            }

            return token
        },
        async session({
            session, token
        }) {
            return {
                user: {
                    id: token.id,
                    name: token.name as string,
                    email: token.email as string,
                    image: session.user.image as string | undefined,
                    provider: token.provider as string | undefined,
                },
                expires: session.expires?.toISOString?.() ?? session.expires,
            }
        }
    },
    providers: [
        GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    ],
    secret: AUTH_SECRET,
    trustHost: true,
    pages: {
        error: "/error",
        // signIn: "/login",
    },
})
