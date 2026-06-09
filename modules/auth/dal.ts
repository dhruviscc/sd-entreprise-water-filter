import 'server-only'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { supabaseAdmin } from "@/lib/server";
import { AUTH_COOKIE_NAME } from './authCookie'

/**
 * Verify the session on the server. 
 * Uses React cache to memoize the result for the duration of a single render pass.
 */
export const verifySession = cache(async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
        return null
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
        return null
    }

    return { isAuth: true, userId: user.id, role: user.user_metadata?.role }
})

/**
 * Get the current user's profile data from the database.
 */
export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, mobile, role, status')
        .eq('id', session.userId)
        .maybeSingle()

    if (error || !profile || profile.status === 'inactive') return null

    return profile
})
