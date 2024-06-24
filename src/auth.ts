import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from "$env/static/private"
import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from "@auth/core/providers/credentials"
import { surrealdb_admin } from "./surrealdb_admin"
import GitHub from "@auth/core/providers/github"

export const { handle, signIn, signOut } = SvelteKitAuth({
    callbacks: {
        async signIn({ user, account }) {
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
                const [[existing_user]] = await surrealdb_admin.query<[({ id: string } | null)[]]>(
                    "SELECT id FROM user WHERE email = $email LIMIT 1",
                { user: user.email }
                )

                // Check if the account exists
                const [[existing_account]] = await surrealdb_admin.query<[({ id: string, user: string } | null)[]]>(
                    "SELECT id, user FROM account WHERE provider_id = $provider_id AND provider = $provider LIMIT 1",
                {
                    provider_id: account.providerAccountId,
                    provider: account.provider,
                }
                )

                if (existing_account && !existing_user) {
                    // If the account exists, but the user does not, that means we need to update the user's email address
                    await surrealdb_admin.query(
                        "UPDATE user SET email = $email WHERE id = $id",
                        { email: user.email, id: existing_account.user }
                    )
                } else if (existing_user && !existing_account) {
                    // If the user exists, but the account does not, that means we need to create the account
                    // and link it to the user
                    await surrealdb_admin.query(
                        `
                        CREATE ONLY account CONTENT {
                            user: $user_id,
                            provider_id: $provider_id,
                            provider: $provider,
                        }
                        `,
                        {
                            user: existing_user.id,
                            provider_id: account.providerAccountId,
                            provider: account.provider,
                        }
                    )
                } else if (!existing_user && !existing_account) {
                    // If the user does not exist, we need to create the user and the account
                    const [new_user] = await surrealdb_admin.query<[{ id: string }]>(
                        `
                        CREATE ONLY user CONTENT $user RETURN id
                        `,
                        {
                            user: {
                                name: user.name,
                                email: user.email,
                                image: user.image,
                            }
                        })

                    await surrealdb_admin.query(
                        `
                        CREATE ONLY account CONTENT {
                            user: $user_id,
                            provider_id: $provider_id,
                            provider: $provider,
                        }
                        `,
                        {
                            user_id: new_user.id,
                            provider_id: account.providerAccountId,
                            provider: account.provider,
                        }
                    )
                } else if (existing_user && existing_account) {
                    // If both the user and the account exist, we need to update the user's settings
                    await surrealdb_admin.query(
                        `
                        UPDATE $user SET
                            name = $name,
                            email = $email,
                            image = $image
                        `,
                        {
                            user: existing_user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        }
                    )
                }
            }

            return true
        },
        async jwt({ token, user, account, profile }) {
            // if there is a profile, that means the user is signing in
            // through a provider, so we must retrieve the user's information
            // via it's account through the sub field
            if(profile && account) {
                const surreal = await surrealdb_admin

                const [[user_id]] = await surreal.query<[string[]]>(
                    "SELECT VALUE user.id FROM account WHERE provider_id = $id AND provider = $provider LIMIT 1",
                    {
                        id: account.providerAccountId,
                        provider: account.provider,
                    }
                )

                user.id = user_id
                user.provider = account.provider
            }
            if(user) {
                token = {
                    id: user.id as string,
                    email: user.email as string,
                    name: user.name as string,
                    image: user.image as string | undefined,
                    provider: user.provider as string | undefined,
                }
            }

            return token
        },
        async session({ session, token }) {
            return {
                user: {
                    id: token.id as string,
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
        Credentials({
            async authorize(credentials) {
                const surreal = await surrealdb_admin

                const res = await surreal.query<[{ id: string, name: string, email: string }[]]>(
                    "SELECT * FROM user WHERE email = $email AND password AND crypto::bcrypt::compare(password, $password) LIMIT 1",
                    {
                        email: credentials.email,
                        password: credentials.password,
                    })

                const user = res?.[0]?.[0]
                if (!user) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            },
        })
    ],
    secret: AUTH_SECRET,
    trustHost: true,
    pages: {
        error: "/error",
        signIn: "/login",
    },
})

