import { getAuthCookie, verifyToken } from './config'
import type { AdminSession } from '@/lib/types/menu'

/**
 * Require authentication via admin PIN cookie.
 * Throws a 401 Response if not authenticated.
 */
export async function requireAuth(): Promise<AdminSession> {
  const token = await getAuthCookie()

  if (!token || !(await verifyToken(token))) {
    throw new Response(
      JSON.stringify({ success: false, error: 'No autenticado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return {
    id: 'admin',
    email: '',
    name: 'Admin',
    role: 'ADMIN',
  }
}
