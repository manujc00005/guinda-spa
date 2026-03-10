import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { serializeDraft } from '@/lib/menu/serialize'

export async function GET(_request: NextRequest) {
  try {
    await requireAuth()

    const snapshot = await serializeDraft()

    return NextResponse.json({ success: true, data: snapshot })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error previewing draft:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
