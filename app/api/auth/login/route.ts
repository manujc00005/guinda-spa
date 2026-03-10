import { NextRequest, NextResponse } from 'next/server'
import { validatePin, createToken, setAuthCookie } from '@/lib/auth/config'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Código requerido' },
        { status: 400 }
      )
    }

    if (!validatePin(pin)) {
      return NextResponse.json(
        { success: false, error: 'Código incorrecto' },
        { status: 401 }
      )
    }

    const token = await createToken()
    await setAuthCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
