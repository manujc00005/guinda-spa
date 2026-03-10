import { NextResponse } from 'next/server'
import { getAuthCookie, verifyToken } from '@/lib/auth/config'

export async function GET() {
  const token = await getAuthCookie()

  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}
