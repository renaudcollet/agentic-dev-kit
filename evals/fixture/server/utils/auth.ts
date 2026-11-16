import type { H3Event } from 'h3'

export interface SessionUser {
  id: string
  email: string
}

// Demo session: reads a user from the `demo-user` cookie.
// Returns null when no user is logged in.
export function getSessionUser(event: H3Event): SessionUser | null {
  const raw = getCookie(event, 'demo-user')
  if (!raw) return null
  try {
    const user = JSON.parse(raw) as Partial<SessionUser>
    return user.id && user.email ? { id: user.id, email: user.email } : null
  }
  catch {
    return null
  }
}
