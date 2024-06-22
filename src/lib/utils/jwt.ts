import { AUTH_SECRET } from "$env/static/private"
import { SignJWT, jwtVerify, type JWTPayload } from "jose"

const secret = new TextEncoder().encode(AUTH_SECRET)

export async function sign_jwt(data: JWTPayload, { expiresIn = "6h" } = {}){
    return await new SignJWT(data)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secret)
}

export async function verify_jwt<T>(token: string){
    return await jwtVerify<T>(token, secret)
}