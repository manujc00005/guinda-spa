import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { prisma } from '@/lib/prisma'
import { serializeDraft } from '@/lib/menu/serialize'
import { diffSnapshots } from '@/lib/menu/diff'
import type { MenuSnapshot } from '@/lib/types/menu'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ versionId: string }> }
) {
  try {
    const session = await requireAuth()

    const { versionId } = await params

    const version = await prisma.menuVersion.findUnique({
      where: { id: versionId },
    })

    if (!version) {
      return NextResponse.json(
        { success: false, error: 'Versión no encontrada' },
        { status: 404 }
      )
    }

    const currentSnapshot = await serializeDraft()

    const diff = diffSnapshots(version.data as unknown as MenuSnapshot, currentSnapshot)

    return NextResponse.json({ success: true, data: diff })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('Error computing diff:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
