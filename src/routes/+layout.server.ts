
export async function load({ locals }) {
    return {
        token: locals.token,
        session: locals.session
    }
}