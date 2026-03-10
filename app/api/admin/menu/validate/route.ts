import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { validateDraft } from '@/lib/menu/validate'

export async function GET(_request: NextRequest) {
  try {
    await requireAuth()

    const validationResult = await validateDraft()

    return NextResponse.json({ success: true, data: validationResult })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error validating draft:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
