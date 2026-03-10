import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COOKIE_NAME = 'admin-token'
const MAX_AGE = 60 * 60 * 24 // 24 hours

function getSecret() {
  const secret = process.env.ADMIN_PIN || '123456'
  return new TextEncoder().encode(`guinda-admin-${secret}-secret-key`)
}

// ---------------------------------------------------------------------------
// JWT helpers
// ---------------------------------------------------------------------------

export async function createToken(): Promise<string> {
  return new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export function validatePin(pin: string): boolean {
  const adminPin = process.env.ADMIN_PIN || '123456'
  return pin === adminPin
}
